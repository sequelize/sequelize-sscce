'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  })

  class Demo extends Model {}
  
  Demo.init({
      foo: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      bar: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
  }, {
      sequelize,
      freezeTableName: true,
  });
  
  await Demo.sync( { force: true } ) ;
    log("Demo synced");
  
  await Demo.create({ foo: "a", bar: "b" });
  await Demo.create({ foo: "a", bar: "c" });

  const queryInterface = sequelize.getQueryInterface();
  queryInterface.addColumn("Demo", "blah", { type: DataTypes.STRING });
  
  Demo.sync({ alter: true });
};
