'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

class BookDetails extends Sequelize.Model {}

// Your SSCCE goes inside this function.
module.exports = async function() {
  if (process.env.DIALECT !== "postgres") return;

  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  BookDetails.init({
    uniqueName: {
        type: Sequelize.DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    originalCategories: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.ENUM({
          values: ['drama', 'comedy'],
        })),
      },
  }, {
      underscored: true,
      modelName: 'BookDetails',
      schema: 'test',
      sequelize
  });
  await BookDetails.sync({force: true});

  /* bulkCreate tries to execute this query:
  INSERT INTO "test"."book_details" ("unique_name","original_categories") VALUES ('test',ARRAY['drama']::"enum_test.book_details_original_categories"[]) RETURNING "unique_name","original_categories";
  when it should execute this:
  INSERT INTO "test"."book_details" ("unique_name","original_categories") VALUES ('test',ARRAY['drama']::"test"."enum_book_details_original_categories"[]) RETURNING "unique_name","original_categories";
  as the array enum type is not called "enum_test.book_details_originalCategories" but "test"."enum_book_details_original_categories" the insert query fails.
  */
  await BookDetails.bulkCreate([{
      uniqueName: 'test',
      originalCategories: ['drama']
  }]);

  /* The issue is that when sequelize generates the enum name is not considering that enums can be inside a schema, and tries to use the full
  name of the object (schema).(table) and adds enum_ at the begining and this is not the logic used for creating the initial value of the enum
  if there is a schema present it should only add enum_ to the table name and use the schema for reference at the begining of the type */

  expect(await BookDetails.count()).to.equal(1);
};
