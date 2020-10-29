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
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
  
    const Parent = sequelize.define('Parent', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      field: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    const Item = sequelize.define('Item', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      field: {
        type: DataTypes.STRING,
      },
    });
  
    Parent.hasMany(Item, { foreignKey: 'parentId', as: 'items' });
    Item.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });
  
    await sequelize.sync();
  
    const _parent = await Parent.create({ field: 'parent 1' });
    await _parent.createItem({ field: 'child item 1' });
    await _parent.createItem({ field: 'child item 2' });
    
    // Upsert parent with same field
    const res = await Parent.upsert({ field: 'parent 1' });
    log(res)
    const [parent] = res;
  
    // Get child elements
    await parent.getItems();
  
    // Items is undefined
    log(parent);
    expect(parent.items).to.equal(undefined);
  
    // Works if you call reload instead
    await parent.reload({ include: 'items' });
    expect(parent.items.length).to.equal(2);
};
