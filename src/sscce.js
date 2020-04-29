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
    if (process.env.DIALECT !== 'mssql') { return; }

    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        badgeNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Key_BadgeCompany'
        },
        companyNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Key_BadgeCompany'
        }
    });
    await sequelize.sync();

    // upsert employee that may already exist
    log(await Employee.upsert({ badgeNumber: 1, companyNumber: 1 }));

    // fails because the upsert generates invalid SQL
    expect(await Employee.count()).to.equal(1);
};
