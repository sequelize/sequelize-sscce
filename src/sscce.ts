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
    name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Foo'
  });

  await sequelize.sync();

  const spyQuery = sinon.spy();

  // "NOT" is missing
  await Foo.findAll({
    logging: spyQuery,
    where: {
      [Op.not]: Sequelize.where(
        Sequelize.cast(Sequelize.col('name'), 'text'),
        Op.like,
        'abc',
      ),
    },
  });

  expect(spyQuery).calledWith('Executed (default): SELECT `id`, `name` FROM `Foos` AS `Foo` WHERE NOT(CAST(`name` AS TEXT) LIKE \'abc\');');

  // crashes with Error: Invalid value { [Symbol(like)]: 'abc' }
  await Foo.findAll({
    logging: spyQuery,
    where: Sequelize.where(
      Sequelize.cast(Sequelize.col('name'), 'text'),
      { [Op.not]: { [Op.like]: 'abc' } },
    ),
  });

  expect(spyQuery).calledWith('Executed (default): SELECT `id`, `name` FROM `Foos` AS `Foo` WHERE CAST(`name` AS TEXT) NOT LIKE \'abc\';');

  // // This one passes
  // await Foo.findAll({
  //   logging: spyQuery,
  //   where: {
  //     [Op.not]: {
  //       name: { [Op.like]: 'abc' },
  //     },
  //   },
  // });
  //
  // expect(spyQuery).calledWith('Executed (default): SELECT `id`, `name` FROM `Foos` AS `Foo` WHERE NOT (CAST(`name` AS TEXT) LIKE \'abc\');');
}
