'use strict';

const wrapOptions = require('./../../setup/wrap-options');
const { Sequelize } = require('sequelize');

module.exports = function createSequelizeInstance(options) {
  return new Sequelize(wrapOptions(options));
};
