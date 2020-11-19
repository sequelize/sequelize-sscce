'use strict';

const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const createSequelizeInstance = require('./utils/create-sequelize-instance');

const log = require('./utils/log');

const { strictEqual } = require('assert');

function test(Model) {
  return () => Model.update({ id: undefined }, { where: { id: undefined }, returning: true });
}

module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
    });
  
    const Foo = sequelize.define('Foo', { id: DataTypes.INTEGER, name: DataTypes.TEXT });
  
    await sequelize.sync();
  
    let threwError = false, returnedEmptyArray = false;
    try {
      const id = undefined;
      
      const [,updated] = Foo.update({ id }, { where: { id }, returning: true });
      
      returnedEmptyArray = Array.isArray(updated) && updated.length === 0;
    } catch (error) {
       threwError = true;
    }
  
    strictEqual(threwError || returnedEmptyArray, true);
};
