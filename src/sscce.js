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
  
    if (process.env.DIALECT !== "postgres") return;

    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Foo = sequelize.define('Foo', { foo: DataTypes.JSONB });
    await sequelize.sync();
    log(await Foo.create({
      foo: {
        bar: [1, 2, 3],
      },
    }));
    expect(await Foo.count()).to.equal(1);
    
    expect(await Foo.findOne({
      where: {
        foo: {
          bar: [1, 2, 3],
        },
      },
    })).to.not.be.null;
};
