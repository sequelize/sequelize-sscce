import { DataTypes, Model } from '@sequelize/core';
import { createSequelize7Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model {}

  Foo.init({
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  const foo = await Foo.create({ name: 'TS foo' });
  console.log('findByPk OK');
  expect(await Foo.findByPk(foo.getDataValue('id'))).to.not.be.null;
  console.log('findByPk fake id with rejectOnEmpty rejects');
  await expect(Foo.findByPk(2000, { rejectOnEmpty: true })).to.be.rejected;
  console.log('findByPk null with rejectOnEmpty should reject');
  await expect(Foo.findByPk(null, { rejectOnEmpty: true })).to.be.rejected;
}
