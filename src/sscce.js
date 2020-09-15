'use strict';

if (process.env.DIALECT !== "postgres") return;

const { Sequelize, DataTypes } = require('sequelize');

const createSequelizeInstance = require('./utils/create-sequelize-instance');

module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Test = sequelize.define('test', {
        a: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
        b: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
        c: {type: DataTypes.STRING, allowNull: false}
    });
    await sequelize.sync();

    await Test.create({
        a: "test",
        b: "one",
        c: ""
    });
    await Test.create({
        a: "test",
        b: "two",
        c: ""
    });

    await sequelize.getQueryInterface().changeColumn('tests', 'c', {
        type: DataTypes.STRING,
        allowNull: true
    });
};
