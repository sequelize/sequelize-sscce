import { DataTypes, Model } from "@sequelize/core";
import { createSequelize7Instance } from "../dev/create-sequelize-instance";
import { expect } from "chai";
import sinon from "sinon";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([
  // "mssql",
  "sqlite",
  // "mysql",
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

  class Foo extends Model {}
  class Bar extends Model {}

  Foo.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Foo",
    }
  );

  Bar.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "BAR",
    }
  );

  Bar.belongsTo(Foo);
  Foo.hasMany(Bar);

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });

  await Foo.create({ name: "TS foo" });
  await Bar.create({ name: "Bar1", FooId: 1 });
  await Bar.create({ name: "Bar2", FooId: 1 });

  const data = await Foo.findAll({
    include: { all: true },
  });

  expect(Object.keys(data).includes("BARs")).to.be.true;
}
