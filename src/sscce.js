"use strict";

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require("./utils/create-sequelize-instance");

// This is an utility logger that should be preferred over `console.log()`.
const log = require("./utils/log");

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require("sinon");
const { expect } = require("chai");

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });

  const Participation = sequelize.define(
    "Participation",
    {
      userId: { field: "user_id", type: DataTypes.INTEGER, allowNull: false },
      campaignId: {
        field: "campaign_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        field: "comment",
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
    }
  );

  // No primary key attribute
  Participation.removeAttribute("id");

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await Participation.create({ userId: 1, campaignId: 1 }));
  expect(await Participation.count()).to.equal(1);

  const p = await Participation.findOne({
    where: { userId: 1, campaignId: 1 },
  });

  p.comment = "Updated campaign";

  expect(await p.save()).not.to.throw; // Boom
};
