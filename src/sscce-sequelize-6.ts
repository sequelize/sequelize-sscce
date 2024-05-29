import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
  });

  class Foo extends Model {}

  Foo.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  expect(Foo.bulkCreate(
    [{ id: 'e8388762-1daa-11ef-b9f0-b7d47c40e7e3' }],
    { updateOnDuplicate: ['createdAt'] }
  )).to.not.be.rejected;
  expect(await Foo.count()).to.equal(1);
}
