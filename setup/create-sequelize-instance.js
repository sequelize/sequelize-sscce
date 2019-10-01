'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const allConfigs = require('./all-configs');
const logging = require('./logging');

module.exports = function createSequelizeInstance(options) {
  if (!process.env.DIALECT) throw new Error('Dialect is not defined! Aborting.');
  const isPostgresNative = process.env.DIALECT === 'postgres-native';
  const dialect = isPostgresNative ? 'postgres' : process.env.DIALECT;

  const config = allConfigs[dialect];

  options = options || {};
  options.dialect = dialect;
  if (isPostgresNative) options.native = true;

  _.defaults(options, {
    logging,
    host: config.host,
    port: config.port,
    pool: config.pool,
    storage: config.storage,
    dialectOptions: config.dialectOptions || {}
  });

  options.__isOptionsObject__ = true;

  return new Sequelize(config.database, config.username, config.password, options);
};