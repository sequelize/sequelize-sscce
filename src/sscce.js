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

  expect(true);
};
