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

  const Foo = sequelize.define('Foo', { data: DataTypes.JSONB });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  // Create instance
  let foo = await Foo.create({ data: { first: 1 } });
  const id = foo.id;

  // Test created instance
  foo = await Foo.findByPk(id);
  expect(foo.data).to.eql({ first: 1 });

  // This works as expected
  foo = await Foo.findByPk(id);
  await foo.update({ 'data.second': 2 });
  foo = await Foo.findByPk(id);
  expect(foo.data).to.eql({ first: 1, second: 2 });

  // This is NOT working
  await Foo.update({ 'data.third': 3 }, { where: { id: foo.id } });
  foo = await Foo.findByPk(id);
  expect(foo.data).to.eql({ first: 1, second: 2, third: 3 });
};
