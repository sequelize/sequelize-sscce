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
  if (process.env.DIALECT !== 'mysql') return;

  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    meta: DataTypes.JSON,
    originalName: DataTypes.STRING,
  });

  const FileLog = sequelize.define('FileLog', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  const FileStatus = sequelize.define(
    'FileStatus',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      statusId: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  File.LOGS = File.hasMany(FileLog, { as: 'logs', foreignKey: 'fileId' });
  FileLog.STATUS = FileLog.belongsTo(FileStatus, {
    as: 'status',
    foreignKey: 'statusId',
    targetKey: 'statusId',
  });

  await sequelize.sync();
  
  const newFile = await File.create({
    name: 'test', 
    meta: {},
    originalName: 'test.jpg',
    logs: [
      { statusId: 101 },
      { statusId: 102 },
      { statusId: 201 },
    ],
  }, { includes: [File.LOGS] });

  log(newFile);
};
