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
  if (process.env.DIALECT !== "postgres") return;

  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });
  const Foo = sequelize.define("Foo", {
    key1: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    key2: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    data: DataTypes.TEXT,
  });
  await sequelize.sync();

  const record1 = await Foo.upsert(
    { key1: 1, key2: 1, data: "1" },
    { returning: true }
  );
  const record2 = await Foo.upsert(
    { key1: 1, key2: 2, data: "2" },
    { returning: true }
  );

  log(record1[0].toString());
  log(record2[0].toString());
  expect(record1[0].toString()).to.not.equal(record2[0].toString());
};
