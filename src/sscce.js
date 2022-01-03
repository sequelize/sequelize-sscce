'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  if (process.env.DIALECT !== "mssql") return;
  
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const ItemModel = sequelize.define('Item', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'Id'
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Code'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'Name'
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Area'
    }
  }, {
    sequelize,
    tableName: 'Item',
    timestamps: false,
    indexes: [
      {
        name: 'IX_Item_U',
        unique: true,
        fields: [ 'Code', 'Name', 'Area' ]
      },
      {
        name: 'PK_Item',
        unique: true,
        fields: [
          { name: 'Id' },
        ]
      },
    ]
  });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  let instance = await ItemModel.upsert({code: 101, name: 'me', area: 56});
  console.log(instance);
};
