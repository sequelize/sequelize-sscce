'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { assert } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
  });

  const Foo = sequelize.define('Foo', {name: DataTypes.TEXT});

  await sequelize.sync();

  const foo = await Foo.create({name: 'foo'});

  assert.equal(foo.createdAt, foo.updatedAt);

  await foo.update({name: 'foo2'})
  assert.isAbove(foo.updatedAt, foo.createdAt);

  const previousUpdatedAt = foo.updatedAt;
  const newUpdatedAt = new Date()
  foo.update({updatedAt: newUpdatedAt})

  assert.isAbove(foo.updatedAt, previousUpdatedAt);
};
