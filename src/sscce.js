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
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Foo = sequelize.define('Foo', { value: DataTypes.GEOGRAPHY });
    await sequelize.sync();
    const x = await Foo.create({ value: {type: "Point", coordinates: [45, 45] }});
    const y = await Foo.create({ value: {type: "Point", coordinates: [45, 45] }});
    log(x);
    log(y);
  
    Object.assign(x, y);
    log(x.changed());
  
    expect(x.changed().to.equal(0));
};
