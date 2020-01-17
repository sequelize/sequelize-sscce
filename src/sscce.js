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
    const Category = sequelize.define('category', {
        // id: {
        //     type: Sequelize.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        //     unique: true,
        //     autoIncrement: false
        // },
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM,
            values: [
                'bundle',
                'goals_bundle',
                'shorts_bundle',
                'singles_bundle',
                'goal'
            ]
        }
    }, { underscored: true });
    await sequelize.sync();
};