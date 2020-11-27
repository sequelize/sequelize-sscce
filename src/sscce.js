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
  if (process.env.DIALECT !== "postgres") return
  
  const opts = {
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  }
  const sequelize1 = createSequelizeInstance(opts)
  const sequelize2 = createSequelizeInstance({...opts, quoteIdentifiers: false})

  const Table1 = sequelize1.define('Table1', {
    col: {
      type: Sequelize.TEXT
    }
  })
  const Table2 = sequelize2.define('Table2', {
    col: {
      type: Sequelize.TEXT
    }
  })

  await Table1.sync()
  await Table2.sync()

  await Table1.create({
    col: 'test value 1'
  })
  await Table2.create({
    col: 'test value 2'
  })

  const [row1] = await Table1.findAll({
    attributes: {
      include: [[Sequelize.literal('1'), 'extraColumn']]
    }
  })
  const [row2] = await Table2.findAll({
    attributes: {
      include: [[Sequelize.literal('2'), 'extraColumn']]
    }
  })
  const [row3] = await Table2.findAll({
    attributes: {
      include: [[Sequelize.literal('3'), 'extra_column']]
    }
  })

  log('row1', row1)
  log('row2', row2)
  log('row3', row3)
  
  expect(row1.dataValues).to.have.property('extraColumn') // works, includes the column extraColumn
  expect(row2.dataValues).to.have.property('extraColumn') // fails, has no extra columns (but the query does)
  expect(row3.dataValues).to.have.property('extra_column') // works, includes the column extra_column
};
