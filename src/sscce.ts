// Require the necessary things from Sequelize
import { Sequelize, Op, Model, DataTypes } from 'sequelize';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
import log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
import sinon = require('sinon');
import { expect } from 'chai';

// Your SSCCE goes inside this function.
export async function run() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class Foo extends Model {};
  Foo.init({
    identifier: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Foo'
  });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  const identifier = "xxxxxxxxxxxx";

  /* typeIsVoid1,-2 & -3 should NOT be instance of Foo but they are. "SSCCE done without errors!" */

  /* Return type is Foo and this is correct. */
  const typeIsFoo = await Foo.create({ identifier });
  log(typeIsFoo);
  expect(typeIsFoo).to.be.instanceOf(Foo);

  /* Return type is void and this is incorrect. It actually returns a Foo instance. */
  const typeIsVoid1 = await Foo.create({ identifier }, { ignoreDuplicates: true });
  log(typeIsVoid1);
  expect(typeIsVoid1).to.be.instanceOf(Foo);

  /* Return type is still void and this is also incorrect. It returns a Foo Instance. */
  const typeIsVoid2 = await Foo.create({ identifier }, { ignoreDuplicates: true, returning: false });
  log(typeIsVoid2);
  expect(typeIsVoid2).to.be.instanceOf(Foo);

  /* Return type is still void and this is also incorrect. It returns a Foo Instance. */
  const typeIsVoid3 = await Foo.create({ identifier: "different" }, { returning: false });
  log(typeIsVoid3);
  expect(typeIsVoid3).to.be.instanceOf(Foo);
}
