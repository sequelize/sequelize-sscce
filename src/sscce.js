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

  const ExampleModel = sequelize.define(
    "ExampleModel",
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      exampleField: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
    }
  );

  await sequelize.sync({ alter: true })
  await sequelize.sync({ alter: true })
  await sequelize.sync({ alter: true })
  await sequelize.sync({ alter: true })
  await sequelize.sync({ alter: true })

  await ExampleModel.create({
    exampleField: '',
    exampleField1: ''
  })

  const result = await ExampleModel.findAll({});

  log(result);
};
