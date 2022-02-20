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
    logging: console.log,
    minifyAliases: true
  });

  const modelOne = sequelize.define('modelOne', {  });
  const modelTwo = sequelize.define('modelTwo', { modelOneId: { type: DataTypes.INTEGER, references: { model: "modelOne", key: "id" } } });
  const modelThree = sequelize.define('modelThree', { modelOneId: { type: DataTypes.INTEGER, references: { model: "modelTwo", key: "id" } } });
  
  modelOne.hasMany(modelTwo);
  modelTwo.belongsTo(modelOne);
  modelTwo.hasMany(modelThree);
  modelThree.belongsTo(modelTwo);

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;
  

  await modelOne.findAll({include: { model: modelTwo, include: [modelThree] }});
};
