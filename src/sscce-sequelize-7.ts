import { DataTypes, Model } from "@sequelize/core";
import { createSequelize7Instance } from "../setup/create-sequelize-instance";
import { Attribute } from "@sequelize/core/decorators-legacy";
import type { Sequelize } from "@sequelize/core";
import { expect } from "chai";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([
  "mssql",
  "sqlite",
  "mysql",
  "mariadb",
  "postgres",
  "postgres-native",
]);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7
class User extends Model {
  @Attribute({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare username: string;

  @Attribute({
    type: DataTypes.DATE,
    allowNull: false,
  })
  declare birthday: Date;
}

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  let sequelize: Sequelize | undefined = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });
  sequelize.addModels([User]);
  await sequelize.sync({ force: true });

  const jane = await User.create({
    username: "janedoe",
    birthday: new Date(1980, 6, 20),
  });

  console.log("\nJane:", jane.toJSON());

  await sequelize.close();
  sequelize = undefined;

  expect(jane.username).to.equal("janedoe");

  const anotherSequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  // Since the previous instance has been closed
  // I expect that I can create another instance
  // and associate the model to this instance
  anotherSequelize.addModels([User]);

  const john = await User.create({
    username: "johndoe",
    birthday: new Date(1990, 6, 20),
  });
  console.log("John:", john.toJSON());

  await anotherSequelize.close();

  expect(john.username).to.equal("johndoe");
}
