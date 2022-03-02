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

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const Invoice = sequelize.define('Invoice', { name: DataTypes.TEXT });
  const LineItem = sequelize.define('LineItem', { name: DataTypes.TEXT });
  const LineItemTaxes = sequelize.define('LineItemTaxes', { name: DataTypes.TEXT });

  Invoice.hasMany(LineItem, { as: 'lineItems' });
  LineItem.hasMany(LineItemTaxes, { as: 'taxes' });
  
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  const invoice = Invoice.create({name: 'INVOICE'});
  invoice.
  
  log(await Invoice.create({ 
    name: 'INVOICE': 
    lineItems:  [
      { name: 'LINE_ITEM_1' },
      { name: 'LINE_ITEM_2' }
    ]
  }));
  
  const result = await Invoice.findAll({
    include: { all: true }
  })
  
  log(JSON.stringify(result, null, 2));
  
  expect(result[0].lineItems.length).to.equal(2);
  
  expect(await Invoice.count()).to.equal(1);
};
