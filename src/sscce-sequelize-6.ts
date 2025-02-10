// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { DataTypes, Model, QueryTypes } from 'sequelize';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

const hookTypes = {
  beforeValidate: { params: 2 },
  afterValidate: { params: 2 },
  validationFailed: { params: 3 },
  beforeCreate: { params: 2 },
  afterCreate: { params: 2 },
  beforeDestroy: { params: 2 },
  afterDestroy: { params: 2 },
  beforeRestore: { params: 2 },
  afterRestore: { params: 2 },
  beforeUpdate: { params: 2 },
  afterUpdate: { params: 2 },
  beforeSave: { params: 2, proxies: ['beforeUpdate', 'beforeCreate'] },
  afterSave: { params: 2, proxies: ['afterUpdate', 'afterCreate'] },
  beforeUpsert: { params: 2 },
  afterUpsert: { params: 2 },
  beforeBulkCreate: { params: 2 },
  afterBulkCreate: { params: 2 },
  beforeBulkDestroy: { params: 1 },
  afterBulkDestroy: { params: 1 },
  beforeBulkRestore: { params: 1 },
  afterBulkRestore: { params: 1 },
  beforeBulkUpdate: { params: 1 },
  afterBulkUpdate: { params: 1 },
  beforeFind: { params: 1 },
  beforeFindAfterExpandIncludeAll: { params: 1 },
  beforeFindAfterOptions: { params: 1 },
  afterFind: { params: 2 },
  beforeCount: { params: 1 },
  beforeDefine: { params: 2, sync: true, noModel: true },
  afterDefine: { params: 1, sync: true, noModel: true },
  beforeInit: { params: 2, sync: true, noModel: true },
  afterInit: { params: 1, sync: true, noModel: true },
  beforeAssociate: { params: 2, sync: true },
  afterAssociate: { params: 2, sync: true },
  beforeConnect: { params: 1, noModel: true },
  afterConnect: { params: 2, noModel: true },
  beforeDisconnect: { params: 1, noModel: true },
  afterDisconnect: { params: 1, noModel: true },
  beforeSync: { params: 1 },
  afterSync: { params: 1 },
  beforeBulkSync: { params: 1 },
  afterBulkSync: { params: 1 },
  beforeQuery: { params: 2 },
  afterQuery: { params: 2 }
};

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

  class Foo extends Model {}

  Foo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  Object.keys(hookTypes).forEach((hook) => {
    Foo.addHook(hook, () => {
      console.log(hook)
    });
  })

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;
  console.log("Start 1")
  await sequelize.transaction(
    async (transaction) => {
      await Foo.findCreateFind({ defaults: { id: 1, name: 'bar'}, where: { name: 'bar' }, transaction});

      console.log("Start 1.1")
      await Foo.findCreateFind({ defaults: { id: 1, name: 'bar'}, where: { name: 'bar' }, transaction});
      
      console.log("Start 1.2")
      await Foo.findOrCreate({ defaults: { id: 2, name: 'baz'}, where: { name: 'baz' }, transaction});

      console.log("Start 1.3")
      await Foo.findOrCreate({ defaults: { id: 2, name: 'baz'}, where: { name: 'baz' }, transaction});
    }
  )
  
  console.log("Start 2")

  console.log(await sequelize.query('SELECT * FROM "Foos"', {
    type: sequelize.QueryTypes.SELECT,
    model: Foo,
  }));
  
  console.log("Start 3")
}
