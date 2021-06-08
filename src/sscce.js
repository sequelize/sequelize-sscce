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
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const model = {
    Endpoint: sequelize.define(
      "endpoint",
      {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING("256"), allowNull: false },
      },
      {
        tableName: "endpoint",
        timestamps: true,
        collate: "utf8_general_ci",
        indexes: [
          {
            unique: true,
            fields: ["name"],
          },
        ],
      }
    ),

    EndpointCall: sequelize.define(
      "endpoint_call",
      {
        endpoint_id: { type: Sequelize.INTEGER, allowNull: false },
        date: { type: Sequelize.DATE, allowNull: false },
        method: { type: Sequelize.STRING("32"), allowNull: false },
        url: { type: Sequelize.STRING("2048"), allowNull: false },
        status_code: { type: Sequelize.INTEGER, allowNull: true },
        response_time: { type: Sequelize.DOUBLE, allowNull: true },
      },
      {
        tableName: "endpoint_call",
        timestamps: false,
        collate: "utf8_general_ci",
      }
    ),

    init: function () {
      this.Endpoint.hasMany(this.EndpointCall, { foreignKey: "endpoint_id" });
      return sequelize.sync();
    },
  };

  await sequelize.sync();

  model.init().then(async () => {
    await model.Endpoint.findAll({
      include: [
        {
          model: model.EndpointCall,
          required: false,
          limit: 1,
          order: [["date", "DESC"]],
        },
      ],
      order: [[{ model: model.EndpointCall }, "date", "DESC"]],
    });
  });
};
