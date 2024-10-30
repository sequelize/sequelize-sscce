import { CreationOptional, DataTypes, DialectName, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

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

  class Foo extends Model<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
    @Attribute(DataTypes.STRING(100))
    @PrimaryKey
    declare name: string;

    @Attribute(DataTypes.STRING(100))
    @PrimaryKey
    declare rank: string;

    @Attribute(DataTypes.STRING(100))
    declare role: CreationOptional<string>;
  }

  sequelize.addModels([Foo]);
  await sequelize.sync({ force: true });

  // Inserting two entries with different name and rank succeeds
  await expect(Foo.create({ name: "fish", rank: "novice" })).to.eventually.be.fulfilled;
  await expect(Foo.create({ name: "fish", rank: "expert" })).to.eventually.be.fulfilled;

  // Inserting two entries with same name and rank fails
  await expect(Foo.create({ name: "cat", rank: "expert" })).to.eventually.be.fulfilled;
  await expect(Foo.create({ name: "cat", rank: "expert" })).to.eventually.be.rejected;

  // Altering an unrelated column should not change the above behaviour
  await Foo.truncate();
  await sequelize.queryInterface.changeColumn("Foos", "role", { type: DataTypes.TEXT });
  await expect(Foo.create({ name: "bear", rank: "novice" })).to.eventually.be.fulfilled;
  await expect(Foo.create({ name: "bear", rank: "expert" })).to.eventually.be.fulfilled;
  await expect(Foo.create({ name: "dog", rank: "expert" })).to.eventually.be.fulfilled;
  await expect(Foo.create({ name: "dog", rank: "expert" })).to.eventually.be.rejected;
}
