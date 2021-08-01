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

  const Foo = sequelize.define('Foo', { name: DataTypes.TEXT, verified: { type: DataTypes.BOOLEAN, default: false }, testString: { type: DataTypes.STRING, default: "test" } });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  const fooInstance = await Foo.create({ name: 'foo' });
  expect(await Foo.count()).to.equal(1);
  expect(fooInstance.verified).to.equal(false);
  expect(fooInstance.testString).to.equal("test");

  const fooInstanceBuild = await Foo.build({ name: 'foo' });
  expect(fooInstanceBuild.verified).to.equal(false);
  expect(fooInstanceBuild.testString).to.equal("test");

  const fooFromDB = await Foo.findByPk(fooInstance.id);

  expect(fooFromDB.verified).to.equal(false)
  expect(fooFromDB.testString).to.equal("test");
};
