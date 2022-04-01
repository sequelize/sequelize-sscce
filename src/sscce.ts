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

  async function getTableColumns(tableName: string): Promise<Array<string>> {
    const [PragmaResults, Metadata] = await sequelize.query(`PRAGMA table_info(${tableName});`)
    return PragmaResults.map((pragmaResult) => (pragmaResult as { name: string }).name)
  }

  const nonNullTextColumn = {
    type: DataTypes.TEXT,
    allowNull: false
  }

  class Foo extends Model {};
  Foo.init({
    firstName: nonNullTextColumn,
    lastName: nonNullTextColumn,
  }, {
    sequelize,
    modelName: 'Foo'
  });

  await sequelize.sync();
  const syncedColumns = await getTableColumns('Foos')
  expect(syncedColumns).contains('firstName')
  expect(syncedColumns).contains('lastName')

  log(await Foo.create({ name: 'TS foo' }));
  expect(await Foo.count()).to.equal(1);
}
