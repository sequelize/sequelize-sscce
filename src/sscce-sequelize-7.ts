import { DataTypes, Model } from "@sequelize/core";
import { createSequelize7Instance } from "../setup/create-sequelize-instance";
import { expect } from "chai";
import sinon from "sinon";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([
  // "mssql",
  // "sqlite",
  "mysql",
  // "mariadb",
  // "postgres",
  // "postgres-native",
]);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  const Action = sequelize.define("Action", {}, { tableName: "Action" });
  const ActionGoto = sequelize.define("Action_Goto", {});

  Action.hasOne(ActionGoto, {
    as: "Goto",
    foreignKey: {
      name: "ActionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
  Action.hasOne(ActionGoto, {
    foreignKey: {
      name: "TargetActionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  ActionGoto.belongsTo(Action, {
    foreignKey: {
      name: "ActionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
  ActionGoto.belongsTo(Action, {
    foreignKey: {
      name: "TargetActionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;
}
