import { DataTypes, Model, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { HasMany, Attribute, Table, PrimaryKey } from "@sequelize/core/decorators-legacy";
import { createSequelize7Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
  @Table({ timestamps: false })
  class Member extends Model<InferAttributes<Member>, InferCreationAttributes<Member>> {
    @Attribute(DataTypes.INTEGER)
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    declare treeId: number;
  }

  @Table({ timestamps: false })
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @HasMany(() => Member, "userId")
    declare members?: NonAttribute<Member[]>;
  }

  @Table({ timestamps: false })
  class Tree extends Model<InferAttributes<Tree>, InferCreationAttributes<Tree>> {
    @HasMany(() => Member, "treeId")
    declare members?: NonAttribute<Member[]>;
  }

  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    models: [Member, User, Tree],
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });


  // You can use sinon and chai assertions directly in your SSCCE.
  await sequelize.sync({ force: true });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ alter: true });
  expect(spy).to.have.been.called;
}
