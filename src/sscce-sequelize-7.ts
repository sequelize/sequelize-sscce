import { BelongsToMany } from '@sequelize/core/decorators-legacy';
import { BelongsToManyAddAssociationMixin, DataTypes, Model } from '@sequelize/core';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';
import { BelongsToManyGetAssociationsMixin } from 'sequelize';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
  class From extends Model {
    @BelongsToMany(() => To, { through: () => Through})
    declare to?: To[];

    declare addTo: BelongsToManyAddAssociationMixin<To, number>;
    declare getTo: BelongsToManyGetAssociationsMixin<To>
  }

  class To extends Model {}

  class Through extends Model {}

  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
    models: [From, To, Through]
  });

  await sequelize.sync();

  const [from, to] = await Promise.all([
    From.create(),
    To.create()
  ]);

  await from.addTo(to);

  const eagerLoadedTo = (await From.findOne({
    include: [To],
    rejectOnEmpty: true
  })).to!;

  const lazyLoadedTo = await (await From.findOne({
    rejectOnEmpty: true
  })).getTo();

  console.log(eagerLoadedTo);
  console.dir(lazyLoadedTo);

  // The through model is loaded as the model name for eager-loaded associations
  expect('Through' in eagerLoadedTo);
  expect(!('fromTo' in eagerLoadedTo));

  // But as the name of the association
  expect(!('Through' in lazyLoadedTo));
  expect('fromTo' in lazyLoadedTo);
}
