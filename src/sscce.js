'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  
    if (process.env.DIALECT !== "mysql") return;

    // ORIGINAL ENVIRONMENT OPTIONS
    // 
    // dialect: 'mysql', // MySQL 5.7
    // dialectOptions: {
    //   supportBigNumbers: true,
    //   bigNumberStrings: true,
    // },
    
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
  
  const Push = sequelize.define('pushes', { 
      // ORIGINAL FIELD DEFINITION
      // PS: It overrides charset/collation once database is set to utf8mb4/utf8mb4_unicode_ci
      //
      // identifier: {
      //  type: `${
      //    Sequelize.CHAR(32).BINARY
      //  } CHARACTER SET 'latin1' COLLATE 'latin1_bin'`,
      //  allowNull: false,
      // },
      identifier: DataTypes.CHAR(32).BINARY, 
      is_active: DataTypes.BOOLEAN 
    });
  
  await sequelize.sync();
  
  log(await Push.create({ 
    identifier: Sequelize.fn(
      'unhex', 
      '46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5'
    ), 
    is_active: true 
  }));
  
  expect(await Push.count({ where: { is_active: true } })).to.equal(1);

  log(await Push.findOne({ 
    where: { 
      identifier: Sequelize.fn(
      'unhex', 
      '46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5'
      )
    }
  }));
  
  log(await Push.update({ is_active: false }, { 
    where: { 
      identifier: Sequelize.fn(
      'unhex', 
      '46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5'
      )
    }
  }));

  expect(await Push.count({ where: { is_active: true } })).to.equal(0);
};
