'use strict';

if (process.env.DIALECT !== "postgres") return;

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes, QueryTypes } = require('sequelize');

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
    const users = sequelize.define('users', {id: DataTypes.INTEGER, name: DataTypes.TEXT });
    await sequelize.sync();
    const result = await sequelize.query("INSERT INTO users (id, name) VALUES (1, 'bob') RETURNING *", {type: QueryTypes.INSERT})
    log(result);
    expect(result[0]).to.equal([{id: 1, name: 'bob'}]);
};
