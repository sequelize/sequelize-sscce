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
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Bar extends Model {}

  Bar.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Bar',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  const afterCommitCb = sinon.spy();
  const nonTransactionCb = sinon.spy();

  const resetSpy = () => {
    afterCommitCb.resetHistory();
    nonTransactionCb.resetHistory();
  }
  
  const afterSaveFooHook = (instance: Bar, options: any) => {
    if (options.transaction) {
      options.transaction.afterCommit(() => afterCommitCb());
      return;
    }
    nonTransactionCb();
  }
  
  await Foo.create({ name: 'A' });
  expect(nonTransactionCb).to.have.been.called;
  expect(afterCommitCb).not.to.have.been.called;

  resetSpy();

  await Foo.findOrCreate({ where: { name: 'B' } });
  expect(nonTransactionCb).not.to.have.been.called;
  expect(afterCommitCb).to.have.been.called;

  resetSpy();
  
  await sequelize.transaction(async (transaction) => {
    await Foo.create({ name: 'C' }, { transaction });
  });
  expect(nonTransactionCb).not.to.have.been.called;
  expect(afterCommitCb).to.have.been.called;

  resetSpy();
  
  // This next case will fail
  
  const internalAfterCommitCb = sinon.spy();
  
  await sequelize.transaction(async (transaction) => {
    transaction.afterCommit(() => internalAfterCommitCb());
    await Foo.findOrCreate({ where: { name: 'D' }, transaction });
  });
  expect(internalAfterCommitCb).to.have.been.called;
  expect(nonTransactionCb).not.to.have.been.called;
  expect(afterCommitCb).to.have.been.called;
}
