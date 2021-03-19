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
    },
    logging: false,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
        encrypt: true,
      },
    },
    define: {
      syncOnAssociation: false,
    },
    syncOnAssociation: false,
    sync: { force: false },
    seederStorage: 'sequelize',
  });

  const Foo = sequelize.define('Foo', { id: DataTypes.INTEGER, name: { DataTypes.TEXT, allowNull: false } });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await Foo.create({ id: 1, name: 'foo' })); // Expected: name can not be null
  expect(await Foo.count()).to.equal(1);
  
  const foos = Foo.findAll({});
  
  console.log(foos) // [ { id: null } ];
  
  const foosRaw = Foo.findAll({ raw: true });
  
  console.log(foosRaw) // [ { id: 1, name: 12 } ];
};
