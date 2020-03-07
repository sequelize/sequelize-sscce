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
  
    const Main = sequelize.define('Main', { 
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
      },
      name: DataTypes.TEXT
    });
  
    const Sub = sequelize.define('Sub', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
      },
      field: DataTypes.TEXT
    });
  
    Main.hasMany(Sub);
  
    await sequelize.sync();
  
    log(await Main.create({ name: 'foo', Subs: [{ field: 'Bar' },{ field: 'baz' }] }, {
      include: {
        model: Sub
      }
    }));
    log(await Main.findAll({
      include: {
        model: Sub
      },
      limit: 1
    }));
};
