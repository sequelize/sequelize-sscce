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
    name: DataTypes.TEXT,
    criteria: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Foo'
  });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  // Creating an instance succeeds, as expected, with JSON being stored as expected
  log(
    await Foo.create({
      name: "TS foo",
      criteria: { foo: [1, 2] },
    })
  );

  // The count verifies that the instance was created
  expect(await Foo.count()).to.equal(1);

  // Attempt to retrieve the record we just created. Running the following will throw an error. Details below.
  await Foo.findAll({
    where: {
      criteria: {
        foo: [1, 2],
      },
    },
  });

  // The query above generates the following SQL, which throws an error.

  // SELECT
  //   `id`,
  //   `name`,
  //   `criteria`
  // FROM
  //   `Foos` AS `Foo`
  // WHERE
  //   CAST(
  //     json_extract(`Foo`.`criteria`, '$.foo') AS DOUBLE PRECISION
  //   ) = 1,
  //   2;
}
