'use strict';

const jetpack = require('fs-jetpack');
const env = process.env;

const DEFAULT_POOL_MAX = 5;
// make idle time small so that tests exit promptly
const DEFAULT_POOL_IDLE_TIME = 3000;

function getMSSQLConfig() {
  const generatedMSSQLJsonConfigPath = 'setup/mssql.json';
  if (jetpack.exists(generatedMSSQLJsonConfigPath)) {
    return JSON.parse(jetpack.read(generatedMSSQLJsonConfigPath));
  }
  return {
    database: env.SEQ_MSSQL_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_MSSQL_USER || env.SEQ_USER || 'sequelize',
    password: env.SEQ_MSSQL_PW || env.SEQ_PW || 'nEGkLma26gXVHFUAHJxcmsrK',
    host: env.SEQ_MSSQL_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.SEQ_MSSQL_PORT || env.SEQ_PORT || 1433,
    dialectOptions: {
      options: {
        requestTimeout: 60000
      }
    },
    pool: {
      max: env.SEQ_MSSQL_POOL_MAX || env.SEQ_POOL_MAX || DEFAULT_POOL_MAX,
      idle: env.SEQ_MSSQL_POOL_IDLE || env.SEQ_POOL_IDLE || DEFAULT_POOL_IDLE_TIME
    }
  };
}

module.exports = {
  username: env.SEQ_USER || 'root',
  password: env.SEQ_PW || null,
  database: env.SEQ_DB || 'sequelize_test',
  host: env.SEQ_HOST || '127.0.0.1',
  pool: {
    max: env.SEQ_POOL_MAX || DEFAULT_POOL_MAX,
    idle: env.SEQ_POOL_IDLE || DEFAULT_POOL_IDLE_TIME
  },

  rand() {
    return parseInt(Math.random() * 999, 10);
  },

  mssql: getMSSQLConfig(),

  mysql: {
    database: env.SEQ_MYSQL_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_MYSQL_USER || env.SEQ_USER || 'root',
    password: env.SEQ_MYSQL_PW || env.SEQ_PW || null,
    host: env.MYSQL_PORT_3306_TCP_ADDR || env.SEQ_MYSQL_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.MYSQL_PORT_3306_TCP_PORT || env.SEQ_MYSQL_PORT || env.SEQ_PORT || 3306,
    pool: {
      max: env.SEQ_MYSQL_POOL_MAX || env.SEQ_POOL_MAX || DEFAULT_POOL_MAX,
      idle: env.SEQ_MYSQL_POOL_IDLE || env.SEQ_POOL_IDLE || DEFAULT_POOL_IDLE_TIME
    }
  },

  mariadb: {
    database: env.SEQ_MARIADB_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_MARIADB_USER || env.SEQ_USER || 'root',
    password: env.SEQ_MARIADB_PW || env.SEQ_PW || null,
    host: env.MARIADB_PORT_3306_TCP_ADDR || env.SEQ_MARIADB_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.MARIADB_PORT_3306_TCP_PORT || env.SEQ_MARIADB_PORT || env.SEQ_PORT || 3306,
    pool: {
      max: env.SEQ_MARIADB_POOL_MAX || env.SEQ_POOL_MAX || DEFAULT_POOL_MAX,
      idle: env.SEQ_MARIADB_POOL_IDLE || env.SEQ_POOL_IDLE || DEFAULT_POOL_IDLE_TIME
    }
  },

  sqlite: {
    storage: ':memory:'
  },

  postgres: {
    database: env.SEQ_PG_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_PG_USER || env.SEQ_USER || 'postgres',
    password: env.SEQ_PG_PW || env.SEQ_PW || 'postgres',
    host: env.POSTGRES_PORT_5432_TCP_ADDR || env.SEQ_PG_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.POSTGRES_PORT_5432_TCP_PORT || env.SEQ_PG_PORT || env.SEQ_PORT || 5432,
    pool: {
      max: env.SEQ_PG_POOL_MAX || env.SEQ_POOL_MAX || DEFAULT_POOL_MAX,
      idle: env.SEQ_PG_POOL_IDLE || env.SEQ_POOL_IDLE || DEFAULT_POOL_IDLE_TIME
    }
  }
};
