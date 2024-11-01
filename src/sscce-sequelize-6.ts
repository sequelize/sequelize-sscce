import { DataTypes, Model, fn, col, where, Association } from "sequelize";
import { createSequelize6Instance } from "../dev/create-sequelize-instance";
import { expect, use } from "chai";
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

  class User extends Model {
    public readonly id!: number;
    public name!: string;
    static Tags: Association;
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  class Tag extends Model {
    public readonly id!: number;
    public name!: string;
    static Users: Association;
  }

  Tag.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );

  class UserTag extends Model {
    public readonly id!: number;
    static User: Association;
    static Tag: Association;
  }

  UserTag.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      // userId: {
      //   type: DataTypes.INTEGER,
      // },
      // tagId: {
      //   type: DataTypes.INTEGER,
      // },
    },
    {
      sequelize,
      modelName: "UserTag",
    }
  );

  UserTag.User = UserTag.hasOne(User);
  UserTag.Tag = UserTag.hasOne(Tag);

  User.Tags = User.belongsToMany(Tag, { through: UserTag });
  Tag.Users = Tag.belongsToMany(User, { through: UserTag });

  // You can use sinon and chai assertions directly in your SSCCE.
  // const spy = sinon.spy();
  // sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  // expect(spy).to.have.been.called;

  const bob = await User.create({ name: "Bob" });
  const joe = await User.create({ name: "Joe" });
  const sue = await User.create({ name: "Sue" });
  const walt = await User.create({ name: "Walt" });
  const ann = await User.create({ name: "Annette" });
  const pat = await User.create({ name: "Patricia" });
  const contribTag = await Tag.create({ name: "Contributer" });
  const adminTag = await Tag.create({ name: "Admin" });
  const ownerTag = await Tag.create({ name: "Owner" });

  await UserTag.create({
    user: bob,
    tag: contribTag,
  });

  await UserTag.create({
    user: joe,
    tag: contribTag,
  });

  await UserTag.create({
    user: sue,
    tag: contribTag,
  });

  await UserTag.create({
    user: walt,
    tag: adminTag,
  });

  await UserTag.create({
    user: ann,
    tag: adminTag,
  });

  await UserTag.create({
    user: pat,
    tag: ownerTag,
  });

  await UserTag.create({
    user: pat,
    tag: adminTag,
  });

  expect(await User.count()).to.equal(6);
  expect(await Tag.count()).to.equal(3);
  expect(await UserTag.count()).to.equal(7);

  const rowsPerPage = 30;
  const page = 1;

  const users = await User.findAll({
    include: [{ association: User.Tags }],
    order: [fn("BOOL_OR", where(col("userTags.tagId"), adminTag.id)), "DESC"],
    group: ["users.id"],
    offset: rowsPerPage * (page - 1),
    limit: rowsPerPage,
  });

  expect(users.length).to.equal(6);
  expect(users[0].name).to.equal("Walt");
  expect(users[1].name).to.equal("Annette");
  expect(users[2].name).to.equal("Patricia");
}
