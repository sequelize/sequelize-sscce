"use strict";

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require("./utils/create-sequelize-instance");

// This is an utility logger that should be preferred over `console.log()`.
const log = require("./utils/log");

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require("chai");

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });

  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable("foo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    col_a: {
      type: Sequelize.STRING,
    },
    col_b: {
      type: Sequelize.STRING,
    },
    col_c: {
      type: Sequelize.STRING,
    },
  });

  await queryInterface.addConstraint("foo", {
    type: "unique",
    name: "col_a_col_b_key",
    fields: ["col_a", "col_b"],
  });

  let indexes = [];

  // As expected, theres a single "index" here for the 2 fields
  indexes = await queryInterface.showIndex("foo");
  log(indexes);
  //   [
  //     {
  //       "seq": 0,
  //       "name": "sqlite_autoindex_foo_1",
  //       "unique": true,
  //       "origin": "u",
  //       "partial": 0,
  //       "fields": [
  //         {
  //           "attribute": "col_a"
  //         },
  //         {
  //           "attribute": "col_b"
  //         }
  //       ],
  //       "primary": false,
  //       "constraintName": "sqlite_autoindex_foo_1"
  //     }
  //   ]

  await queryInterface.removeColumn("foo", "col_c");

  // After column remove however,
  // the single multi-column constraint is converted to 2 individual column constraints
  indexes = await queryInterface.showIndex("foo");
  log(indexes);
  // [
  //     {
  //       "seq": 1,
  //       "name": "sqlite_autoindex_foo_1",
  //       "unique": true,
  //       "origin": "u",
  //       "partial": 0,
  //       "fields": [
  //         {
  //           "attribute": "col_a"
  //         }
  //       ],
  //       "primary": false,
  //       "constraintName": "sqlite_autoindex_foo_1"
  //     },
  //     {
  //       "seq": 0,
  //       "name": "sqlite_autoindex_foo_2",
  //       "unique": true,
  //       "origin": "u",
  //       "partial": 0,
  //       "fields": [
  //         {
  //           "attribute": "col_b"
  //         }
  //       ],
  //       "primary": false,
  //       "constraintName": "sqlite_autoindex_foo_2"
  //     }
  //   ]

  // Unfortunately not sure how to clean up after this
  for (const index of indexes) {
    // This doesn't work
    // await queryInterface.removeConstraint("foo", index.name);
    //
    // It throws:
    //     UnknownConstraintError [SequelizeUnknownConstraintError]: Constraint sqlite_autoindex_foo_1 on table foo does not exist
    //     at SQLiteQueryInterface.removeConstraint (C:\Users\rickb\code\sequelize-sscce\node_modules\sequelize\lib\dialects\sqlite\query-interface.js:82:13)
    //     at processTicksAndRejections (internal/process/task_queues.js:97:5)
    //     at async module.exports (C:\Users\rickb\code\sequelize-sscce\src\sscce.js:114:12)
    //     at async run (C:\Users\rickb\code\sequelize-sscce\setup\runner.js:24:9)
    //     at async C:\Users\rickb\code\sequelize-sscce\setup\runner.js:30:9 {
    //   name: 'SequelizeUnknownConstraintError',
    //   parent: { sql: '' },
    //   original: { sql: '' },
    //   sql: '',
    //   parameters: undefined,
    //   message: 'Constraint sqlite_autoindex_foo_1 on table foo does not exist',
    //   constraint: 'sqlite_autoindex_foo_1',
    //   fields: undefined,
    //   table: 'foo'
    // }
    //
    //
    // Can't remove the index either
    // await queryInterface.removeIndex("foo", index.name);
    // This throws an error saying indexes associated with unique constraints cannot be dropped
    //
    // DatabaseError [SequelizeDatabaseError]: SQLITE_ERROR: index associated with UNIQUE or PRIMARY KEY constraint cannot be dropped
    // at Query.formatError (C:\Users\rickb\code\sequelize-sscce\node_modules\sequelize\lib\dialects\sqlite\query.js:415:16)
    // at Query._handleQueryResponse (C:\Users\rickb\code\sequelize-sscce\node_modules\sequelize\lib\dialects\sqlite\query.js:72:18)
    // at afterExecute (C:\Users\rickb\code\sequelize-sscce\node_modules\sequelize\lib\dialects\sqlite\query.js:246:27)
    // at Statement.errBack (C:\Users\rickb\code\sequelize-sscce\node_modules\sqlite3\lib\sqlite3.js:14:21) {
    // name: 'SequelizeDatabaseError',
    // parent: [Error: SQLITE_ERROR: index associated with UNIQUE or PRIMARY KEY constraint cannot be dropped] {
    // errno: 1,
    // code: 'SQLITE_ERROR',
    // sql: 'DROP INDEX IF EXISTS `sqlite_autoindex_foo_1`'
    // },
    // original: [Error: SQLITE_ERROR: index associated with UNIQUE or PRIMARY KEY constraint cannot be dropped] {
    // errno: 1,
    // code: 'SQLITE_ERROR',
    // sql: 'DROP INDEX IF EXISTS `sqlite_autoindex_foo_1`'
    // },
    // sql: 'DROP INDEX IF EXISTS `sqlite_autoindex_foo_1`',
    // parameters: undefined
    // }
  }
};
