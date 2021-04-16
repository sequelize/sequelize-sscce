'use strict';

if (process.env.DIALECT !== "postgres") return;

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
      sequelize
  });
  await BookDetails.sync({force: true});

  /* bulkCreate tries to execute this query:
  INSERT INTO "book_details" ("unique_name","original_categories","created_at","updated_at") VALUES ('test',ARRAY['drama']::"enum_book_details_originalCategories"[],'2021-04-16 19:38:40.298 +00:00','2021-04-16 19:38:40.298 +00:00') RETURNING "unique_name","original_categories","created_at","updated_at";

  when it should execute this:
  INSERT INTO "book_details" ("unique_name","original_categories","created_at","updated_at") VALUES ('test',ARRAY['drama']::"enum_book_details_original_categories"[],'2021-04-16 19:38:40.298 +00:00','2021-04-16 19:38:40.298 +00:00') RETURNING "unique_name","original_categories","created_at","updated_at";

  as the array enum type is not called enum_book_details_originalCategories but enum_book_details_original_categories the insert query fails.
  */
  await BookDetails.bulkCreate([{
      uniqueName: 'test',
      originalCategories: ['drama']
  }]);
  
  /* The issue is that when sequelize creates the type, it properly uses the undercored property and creates a type named: enum_book_details_original_categories
  but when doing queries (and this particular error appears on .bulkCreate but not on .create, on lib/dialects/postgres/data-types.js:483 to generate the enum
  name the code is using options.field.fieldName (that is the not undercored version) instead of the proper undercored value: options.field.field */
  
  expect(await BookDetails.count()).to.equal(1);
};
