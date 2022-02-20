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

if (process.env.DIALECT !== "postgres") return;

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    },
    logging: console.log,
    minifyAliases: true,
    underscore: true
  });

  const modelOne = sequelize.define('modelOne', {  }, { paranoid: true});
  const modelTwo = sequelize.define('modelTwo', { modelOneId: { type: DataTypes.INTEGER, references: { model: "modelOnes", key: "id" } } }, { paranoid: true});
  const modelThree = sequelize.define('modelThree', { modelOneId: { type: DataTypes.INTEGER, references: { model: "modelTwos", key: "id" } } }, { paranoid: true});
  const modelFour = sequelize.define('modelWithVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongName', { modelOneId: { type: DataTypes.INTEGER, references: { model: "modelThrees", key: "id" } } }, { paranoid: true});
  
  modelOne.hasMany(modelTwo);
  modelTwo.belongsTo(modelOne);
  modelTwo.hasMany(modelThree);
  modelThree.belongsTo(modelTwo);
  modelThree.hasMany(modelFour);
  modelFour.belongsTo(modelThree);

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;
  

  await modelOne.findAll({include: { model: modelTwo, include: [{ model: modelThree, include: [modelFour]}] }});
};
