#!/bin/bash -c

npm i;

if [ "$DIALECT" = "postgres" ]; then
  npm i pg@^7 pg-hstore@^2 pg-types@^2;
elif [ "$DIALECT" = "postgres-native" ]; then
  npm i pg@^7 pg-hstore@^2 pg-types@^2 pg-native;
elif [ "$DIALECT" = "mysql" ]; then
  npm i mysql2@^1;
elif [ "$DIALECT" = "mariadb" ]; then
  npm i mariadb@^2;
elif [ "$DIALECT" = "sqlite" ]; then
  npm i sqlite3@^4;
elif [ "$DIALECT" = "mssql" ]; then
  npm i tedious@^6
fi
