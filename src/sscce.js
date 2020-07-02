'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  if (process.env.DIALECT !== "mssql") return;

  const sequelize = createSequelizeInstance({
    dialect: 'mssql',
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });
  
  var testTable = sequelize.define("test_table", {
      Name: {
          type: DataTypes.STRING,
          primaryKey: true
      },
      Age: {
          type: DataTypes.INTEGER
      },
      IsOnline: {
          type: DataTypes.BOOLEAN,
          primaryKey: true
      }
  }, {
      freezeTableName: true,
      timestamps : false
  });
 
  await testTable.upsert({
    "Name": "Charlie",
    "Age": 24,
    "IsOnline": false   
  });
};
