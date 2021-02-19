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

  const user = sequelize.define ('user', {}, {timestamps: false});
  const team = sequelize.define ('team', {}, {timestamps: false});
  const project = sequelize.define ('project', {}, {timestamps: false});

  project.hasMany (user);
  user.belongsTo (team);

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  await project.bulkCreate ([{}, {}]);

  await project.findAll ({
      include: [{
          model: user,
          "limit": 1,
          "include": [
              {
                  model: team
              }
          ],
          "attributes": ["id"],
      }]
  });

//   log(await Foo.create({ name: 'TS foo' }));
//   expect(await Foo.count()).to.equal(1);
}
