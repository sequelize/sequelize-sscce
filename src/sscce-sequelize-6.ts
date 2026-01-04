import { DataTypes, fn, literal, Model, Sequelize } from "sequelize";
import { createSequelize6Instance } from "../dev/create-sequelize-instance";
import { expect } from "chai";
import sinon from "sinon";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([
  "mssql",
  "sqlite",
  "mysql",
  "mariadb",
  "postgres",
  "postgres-native",
]);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  const authors = sequelize.define(
    "authors",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
    },
    {
      tableName: "authors",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  const books = sequelize.define(
    "books",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "authors",
          key: "id",
        },
        field: "author_id",
      },
      publishedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "published_date",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
    },
    {
      tableName: "books",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "author_id",
          using: "BTREE",
          fields: [{ name: "author_id" }],
        },
      ],
    }
  );

  authors.hasMany(books, { foreignKey: "authorId" });
  await sequelize.sync({ force: true });

  await sequelize.query(
    "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));"
  );

  await authors.bulkCreate([
    { name: "Author 1", bio: "Bio for author 1" },
    { name: "Author 2", bio: "Bio for author 2" },
  ]);

  const result = await authors
    .findAll({
      where: { name: ["Author 1", "Author 2"] },
      include: [
        {
          model: books,
          // separate: true,
          limit: 5,
          attributes: [[fn("MAX", literal("`books`.`id`")), "maxId"], "title"],
        },
      ],
    })
    .then((res) => JSON.stringify(res, null, 2));

  expect(result).to.eql(`[
  {
    "id": 1,
    "name": "Author 1",
    "bio": "Bio for author 1",
    "createdAt": "2024-09-04T07:45:26.000Z",
    "books": []
  },
  {
    "id": 2,
    "name": "Author 2",
    "bio": "Bio for author 2",
    "createdAt": "2024-09-04T07:45:26.000Z",
    "books": []
  }
]`);
}
