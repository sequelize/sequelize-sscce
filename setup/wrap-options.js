'use strict';

const defaults = require('lodash.defaults');
const CIDBConfigs = require('./ci-db-configs');
const logging = require('./logging');

module.exports = function wrapOptions(options) {
  if (!process.env.DIALECT) throw new Error('Dialect is not defined! Aborting.');
  const isPostgresNative = process.env.DIALECT === 'postgres-native';
  const dialect = isPostgresNative ? 'postgres' : process.env.DIALECT;

  const config = CIDBConfigs[dialect];

  options = options || {};
  options.dialect = dialect;
  if (isPostgresNative) options.native = true;

  defaults(options, {
    logging,
    database: config.database,
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
    pool: config.pool,
    storage: config.storage,
    dialectOptions: config.dialectOptions || {}
  });

  options.__isOptionsObject__ = true;

  return options;
};