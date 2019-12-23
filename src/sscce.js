'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ logQueryParameters: true, benchmark: true });
    const Foo = sequelize.define('Foo', { name: DataTypes.STRING });
    log(await sequelize.query(`SET TIMEZONE TO 'CET'`));
    log(await sequelize.sync());
    log(await sequelize.query(`SELECT NOW()`));
    log(await Foo.create({ name: 'xyz' }));
    log(await sequelize.query(`SELECT "createdAt" FROM "Foos"`));
    log(await Foo.findOne({ plain: true, raw: true }));
};