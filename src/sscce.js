'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const Foo = sequelize.define('Foo', { name: DataTypes.TEXT });
  
  class Demo extends Model {}
  
  Demo.init({
      foo: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      bar: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
  });
  
  Demo.sync();
  
  await Demo.create({ foo: "a", bar: "b" });
  await Demo.create({ foo: "a", bar: "c" });

  const queryInterface = sequelize.getQueryInterface();
  queryInterface.addColumn("Demo", "blah", { type: DataTypes.STRING });
  
  Demo.sync({ alter: true });
           
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await Foo.create({ name: 'foo' }));
  expect(await Foo.count()).to.equal(1);
};
