'use strict';

const host = 'localhost';
const username = 'sequelize_test';
const password = 'sequelize_test';
const database = 'sequelize_test';
const pool = {
  max: 5,
  idle: 3000 // make idle time small so that tests exit promptly
};

module.exports = {
  mysql: { host, username, password, database, port: 3306, pool },

  mariadb: { host, username, password, database, port: 3306, pool },

  sqlite: { storage: ':memory:' },

  postgres: { host, username, password, database, port: 5432, pool },

  mssql: {
    host,
    username: 'SA',
    password: 'Password12!',
    database,
    port: 1433,
    pool,
    dialectOptions: {
      options: {
        encrypt: false,
        requestTimeout: 25000
      }
    }
  }
};
