import { DataTypes, Model } from "@sequelize/core";
import { createSequelize7Instance } from "../setup/create-sequelize-instance";
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

  class Post extends Model {}
  class Author extends Model {}

  Post.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: DataTypes.TEXT,
      authorId: DataTypes.INTEGER,
      coAuthorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  Author.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Author",
    }
  );

  Post.belongsTo(Author, {
    foreignKey: "authorId",
    as: "author",
    targetKey: "id",
    inverse: { as: "myBooks", type: "hasMany" },
  });

  Post.belongsTo(Author, {
    foreignKey: "coAuthorId",
    as: "coAuthor",
    targetKey: "id",
    inverse: { as: "notMyBooks", type: "hasMany" },
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  // Not needed since sync not working
  // console.log(await Post.create({ name: 'TS foo' }));
  // expect(await Post.count()).to.equal(1);
}
