// Require the necessary things from Sequelize
import { Model, DataTypes, literal } from "sequelize";

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
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class GrandParent extends Model {}
  GrandParent.init(
    {
      name: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: "GrandParent"
    }
  );

  class Parent extends Model {}
  Parent.init(
    {
      name: DataTypes.TEXT,
      order: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: "Parent"
    }
  );

  class Child extends Model {}
  Child.init(
    {
      name: DataTypes.TEXT,
      order: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: "Child"
    }
  );

  GrandParent.hasOne(Parent, { as: "parent" });
  Parent.hasMany(Child, { as: "child" });

  await sequelize.sync();

  log(await GrandParent.create({ id: 1, name: "Foo" }));
  log(
    await Parent.create({ id: 1, GrandParentId: 1, name: "Bar", order: "1" })
  );
  log(
    await Child.create({
      id: 1,
      ParentId: 1,
      name: "Baz",
      order: "Not A Number"
    })
  );

  log(
    await GrandParent.findAll({
      include: [
        {
          model: Parent,
          required: true,
          as: 'parent',
          include: [
            {
              model: Child,
              as: 'child',
              where: {
                name: "Baz"
              }
            }
          ]
        }
      ],
      where: {
        name: "Foo"
      },
      limit: 1,
      order: [literal(
        `NULLIF(CASE "parent->child"."order" ~ '^[1-5]$' WHEN TRUE THEN "parent->child"."order" ELSE '' END, '')::INT DESC NULLS LAST`
      )]
    })
  );
}
