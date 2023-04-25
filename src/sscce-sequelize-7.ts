import { DataTypes, Model } from '@sequelize/core';
import { createSequelize7Instance } from '../setup/create-sequelize-instance';
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

 class FooModel extends Model {}

  FooModel.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true}
    },
    {sequelize, modelName: 'FooModel'}
  );

  await FooModel.sync();

  class OtherModel extends Model {}

  OtherModel.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      modelId: {type: DataTypes.STRING, field: 'model_id'},
      modelType: {type: DataTypes.ENUM('foo', 'bar'), field: 'model_type'}
    },
    {sequelize, modelName: 'OtherModel'}
  );

  await OtherModel.sync();

  FooModel.hasMany(OtherModel, {
    foreignKey: 'modelId',
    scope: {
      modelType: 'foo'
    }
  });

  await FooModel.findAndCountAll({
    include: {
      model: OtherModel
    }
  });
}
