'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const createSequelizeInstance = require('./utils/create-sequelize-instance');
const log = require('./utils/log');

module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const Foo = sequelize.define('test', {
    pk1: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    pk2: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});

  await sequelize.sync();
  await model.findOne({
    where: {pk1: 'foo'},
    logging: log
  });
};
