const { env } = process;

export const CiDbConfigs = {
  mssql: {
    host: env.SEQ_MSSQL_HOST || env.SEQ_HOST || 'localhost',
    username: env.SEQ_MSSQL_USER || env.SEQ_USER || 'SA',
    password: env.SEQ_MSSQL_PW || env.SEQ_PW || 'Password12!',
    port: env.SEQ_MSSQL_PORT || env.SEQ_PORT || 22_019,
    database: env.SEQ_MSSQL_DB || env.SEQ_DB || 'sequelize_test',
    dialectOptions: {
      options: {
        encrypt: false,
        requestTimeout: 25_000,
      },
    },
    pool: {
      max: Number(env.SEQ_MSSQL_POOL_MAX || env.SEQ_POOL_MAX || 5),
      idle: Number(env.SEQ_MSSQL_POOL_IDLE || env.SEQ_POOL_IDLE || 3000),
    },
  },

  mysql: {
    database: env.SEQ_MYSQL_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_MYSQL_USER || env.SEQ_USER || 'sequelize_test',
    password: env.SEQ_MYSQL_PW || env.SEQ_PW || 'sequelize_test',
    host: env.MYSQL_PORT_3306_TCP_ADDR || env.SEQ_MYSQL_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.MYSQL_PORT_3306_TCP_PORT || env.SEQ_MYSQL_PORT || env.SEQ_PORT || 20_057,
    pool: {
      max: Number(env.SEQ_MYSQL_POOL_MAX || env.SEQ_POOL_MAX || 5),
      idle: Number(env.SEQ_MYSQL_POOL_IDLE || env.SEQ_POOL_IDLE || 3000),
    },
  },

  snowflake: {
    username: env.SEQ_SNOWFLAKE_USER || env.SEQ_USER || 'root',
    password: env.SEQ_SNOWFLAKE_PW || env.SEQ_PW || '',
    database: env.SEQ_SNOWFLAKE_DB || env.SEQ_DB || 'sequelize_test',
    dialectOptions: {
      account: env.SEQ_SNOWFLAKE_ACCOUNT || env.SEQ_ACCOUNT || 'sequelize_test',
      role: env.SEQ_SNOWFLAKE_ROLE || env.SEQ_ROLE || 'role',
      warehouse: env.SEQ_SNOWFLAKE_WH || env.SEQ_WH || 'warehouse',
      schema: env.SEQ_SNOWFLAKE_SCHEMA || env.SEQ_SCHEMA || '',
    },
  },

  mariadb: {
    database: env.SEQ_MARIADB_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_MARIADB_USER || env.SEQ_USER || 'sequelize_test',
    password: env.SEQ_MARIADB_PW || env.SEQ_PW || 'sequelize_test',
    host: env.MARIADB_PORT_3306_TCP_ADDR || env.SEQ_MARIADB_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.MARIADB_PORT_3306_TCP_PORT || env.SEQ_MARIADB_PORT || env.SEQ_PORT || 21_103,
    pool: {
      max: Number(env.SEQ_MARIADB_POOL_MAX || env.SEQ_POOL_MAX || 5),
      idle: Number(env.SEQ_MARIADB_POOL_IDLE || env.SEQ_POOL_IDLE || 3000),
    },
  },

  sqlite: {},

  postgres: {
    database: env.SEQ_PG_DB || env.SEQ_DB || 'sequelize_test',
    username: env.SEQ_PG_USER || env.SEQ_USER || 'sequelize_test',
    password: env.SEQ_PG_PW || env.SEQ_PW || 'sequelize_test',
    host: env.POSTGRES_PORT_5432_TCP_ADDR || env.SEQ_PG_HOST || env.SEQ_HOST || '127.0.0.1',
    port: env.POSTGRES_PORT_5432_TCP_PORT || env.SEQ_PG_PORT || env.SEQ_PORT || 23_010,
    pool: {
      max: Number(env.SEQ_PG_POOL_MAX || env.SEQ_POOL_MAX || 5),
      idle: Number(env.SEQ_PG_POOL_IDLE || env.SEQ_POOL_IDLE || 3000),
    },
    minifyAliases: Boolean(env.SEQ_PG_MINIFY_ALIASES),
  },
};
