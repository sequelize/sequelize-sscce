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
    if (process.env.DIALECT !== "postgres") return;
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const schema = 'admin';
    await sequelize.createSchema(schema);
    const Foo = sequelize.define('Foo', { name: DataTypes.TEXT }, {schema});
    const Bar = sequelize.define('Bar', { name: DataTypes.TEXT }, {schema});
    Foo.hasMany(Bar);
    Bar.belongsTo(Foo);
    const request = `SELECT count (*) FROM information_schema.table_constraints AS tc 
			JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
			JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
			WHERE constraint_type = 'FOREIGN KEY' AND tc.table_schema = '${schema}' AND tc.table_name = 'Bars'`;

    await sequelize.sync({alter: true});
    expect((await sequelize.query(request))[0][0].count == 1);
    await sequelize.sync({alter: true});
    expect((await sequelize.query(request))[0][0].count == 1);
};
