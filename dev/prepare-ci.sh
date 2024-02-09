#!/bin/bash -c

yarn install --ignore-engines;

if [ "$DIALECT" = "postgres" ]; then
  yarn add pg@^8 pg-hstore@^2 pg-types@^2 --ignore-engines;
elif [ "$DIALECT" = "postgres-native" ]; then
  yarn add pg@^8 pg-hstore@^2 pg-types@^2 pg-native --ignore-engines;
elif [ "$DIALECT" = "mysql" ]; then
  yarn add mysql2@^2 --ignore-engines;
elif [ "$DIALECT" = "mariadb" ]; then
  yarn add mariadb@^2 --ignore-engines;
elif [ "$DIALECT" = "sqlite" ]; then
  yarn add sqlite3@^5 --ignore-engines;
elif [ "$DIALECT" = "mssql" ]; then
  yarn add tedious@^8 --ignore-engines;
fi
