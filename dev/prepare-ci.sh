#!/bin/bash -c

yarn install --ignore-engines;

if [ "$DIALECT" = "postgres" ]; then
  yarn add pg@^8 pg-hstore@^2 pg-types@^2 @sequelize/postgres --ignore-engines;
elif [ "$DIALECT" = "postgres-native" ]; then
  yarn add pg@^8 pg-hstore@^2 pg-types@^2 pg-native @sequelize/postgres --ignore-engines;
elif [ "$DIALECT" = "mysql" ]; then
  yarn add mysql2@^2 @sequelize/mysql --ignore-engines;
elif [ "$DIALECT" = "mariadb" ]; then
  yarn add mariadb@^2 @sequelize/mariadb --ignore-engines;
elif [ "$DIALECT" = "sqlite" ]; then
  yarn add sqlite3@^5 @sequelize/sqlite3 --ignore-engines;
elif [ "$DIALECT" = "mssql" ]; then
  yarn add tedious@^8 @sequelize/mssql --ignore-engines;
fi
