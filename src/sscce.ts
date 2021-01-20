// Require the necessary things from Sequelize
import { Model, DataTypes } from "sequelize";

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require("./utils/create-sequelize-instance");

// This is an utility logger that should be preferred over `console.log()`.
import log = require("./utils/log");

// You can use chai assertions directly in your SSCCE if you want.
import { expect } from "chai";

// Your SSCCE goes inside this function.
export async function run() {
  if (process.env.DIALECT !== "postgres") return;

  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });

  class User extends Model {}
  User.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      schema: "schema1",
      modelName: "User",
    }
  );

  class Product extends Model {}
  Product.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      schema: "schema2",
      modelName: "Product",
    }
  );

  Product.belongsTo(User);

  await sequelize.sync({ alter: true });
}
