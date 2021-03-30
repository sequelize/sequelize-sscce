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

    
  const Order = sequelize.define(
      "Order",
      {
          status: DataTypes.STRING,
          price: DataTypes.FLOAT,
      },
      {
          hooks: {
              beforeValidate: (order) =>
                  (order.status =
                      typeof order.price === "number" ? "complete" : "pending"),
          },
          sequelize,
      }
  );

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  // Creation
  const newOrder = await Order.create();

  // Subsequent update
  newOrder.set({ price: 10.0 });
  await newOrder.save();
  log(newOrder) // App shows the updated `status`

  // Re-inspect the actual db state
  const sameOrder = await Order.findByPk(newOrder.id);
  log(sameOrder)

  // Fails: Sequelize never updated this field in db
  expect(sameOrder.status).to.equal(newOrder.status);
};
