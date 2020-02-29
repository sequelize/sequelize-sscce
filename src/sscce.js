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
    class TestModel extends Sequelize.Model {}
    TestModel.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      },
      { sequelize, paranoid: true }
    )
    await TestModel.sync()
    const t = await TestModel.create({ id: 1 })
    expect(await TestModel.count()).to.equal(1)
    await t.destroy()
    expect(await TestModel.count()).to.equal(0)
    expect(await TestModel.count({ paranoid: false })).to.equal(1)
    await TestModel.upsert({ id: 1 }, { logging: true })
    expect(await TestModel.count()).to.equal(1)
};
