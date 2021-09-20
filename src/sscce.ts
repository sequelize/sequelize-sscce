// Require the necessary things from Sequelize
import { Sequelize, Op, Model, DataTypes } from 'sequelize';
import * as cls from 'cls-hooked';

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
  const namespace = cls.createNamespace('test');
  Sequelize.useCLS(namespace);
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.transaction(async (t) => {
    await sequelize.sync();
  });
  expect(spy).to.have.been.called;  
}
