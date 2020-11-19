'use strict';

const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const createSequelizeInstance = require('./utils/create-sequelize-instance');

const log = require('./utils/log');

const { strictEqual } = require('assert');

module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
    });
  
    const Foo = sequelize.define('Foo', { id: { type: DataTypes.INTEGER, primaryKey: true }, name: DataTypes.TEXT });
  
    await sequelize.sync();
  
    const id = undefined;  
    const result = Foo.update({ id }, { where: { id }, returning: true });
  
    log('result: ', result);
  
    strictEqual(Array.isArray(result[1]), false);
};
