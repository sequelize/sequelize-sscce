'use strict'

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize')

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance')

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log')

// You can use chai assertions directly in your SSCCE if you want.
const { assert } = require('chai')

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters : true,
    benchmark : true,
    define : {
      timestamps : false, // For less clutter in the SSCCE
    },
  })
  const Service = sequelize.define('Service', { name : DataTypes.STRING })
  const Tariff = sequelize.define('Tariff', { name : DataTypes.STRING })
  await sequelize.sync()
  Service.findAll({
    attributes : [
      'id',
      'name',
      [sequelize.fn('COUNT', sequelize.col('tariffs.id')), 'tariffsTotal'],
    ],
    include : Tariff,
    group : ['Service.id'],
    order : [['id', 'DESC']],
    limit : 5,
    offset : 2,
  })
  .then(log)
  .catch(err => assert.fail(err.message))
}
