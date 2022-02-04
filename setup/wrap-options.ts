import defaults from 'lodash/defaults.js';
import { CiDbConfigs } from './ci-db-configs.js';
import { log } from './logging.js';

module.exports = function wrapOptions(options) {
  if (!process.env.DIALECT) throw new Error('Dialect is not defined! Aborting.');
  const isPostgresNative = process.env.DIALECT === 'postgres-native';
  const dialect = isPostgresNative ? 'postgres' : process.env.DIALECT;

  const config = CiDbConfigs[dialect];

  options = options || {};
  options.dialect = dialect;
  if (isPostgresNative) {
    options.native = true;
  }

  defaults(options, {
    logging: log,
    database: config.database,
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
    pool: config.pool,
    storage: config.storage,
    dialectOptions: config.dialectOptions || {},
  });

  options.__isOptionsObject__ = true;

  return options;
};
