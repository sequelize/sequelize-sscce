'use strict';

const { tz } = require('moment-timezone');
tz.setDefault('CAT'); // Or another timezone

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true, logQueryParameters: true });
    const Foo = sequelize.define('Foo', { name: DataTypes.STRING });
    await sequelize.sync();
    log(await sequelize.query(`SET TIMEZONE TO 'CET'`));
    log(await sequelize.query(`SELECT NOW()`));
    log(await Foo.create({ name: 'xyz' }));
    log(await sequelize.query(`SELECT "createdAt" FROM "Foos"`));
};
