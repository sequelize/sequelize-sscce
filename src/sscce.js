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

    // first get the database name
    const dbName = sequelize.config.database;
    // change the collation
    await sequelize.query('ALTER DATABASE ' + dbName + ' COLLATE SQL_Latin1_General_CP1_CS_AS');
    
    // const Foo = sequelize.define('Foo', { name: DataTypes.TEXT });
    // await sequelize.sync();
    log(await sequelize.createSchema('foo'));
    expect(1).to.equal(1);
};
