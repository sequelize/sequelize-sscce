'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const User = sequelize.define('User', {
        // id (default)
        username: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING
    });
    await sequelize.sync();
    await User.create({
        username: "s0me0ne",
        firstName: "Some",
        lastName: "One",
        email: "user@whatever.com"
    });
    const u = await User.findOne({
        attributes: ["id", "username", "firstName", "lastName", "email"],
        where: { email: "user@whatever.com" }
    });
    await u.destroy();
};