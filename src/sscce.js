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
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
     const somemodel = sequelize.define('somemodel', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },  
  }); 
  await sequelize.sync();
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.createTable('somemodel', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },  
  }); 
  await queryInterface.addColumn(
    'somemodel',
    'some_date',
    {   
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: '', 
    },  
  );  
  await somemodel.create();
  expect(await somemodel.count()).to.equal(1);
};
