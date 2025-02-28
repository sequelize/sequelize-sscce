import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres', 'postgres-native']);

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

  class Foo extends Model {}

  Foo.init({
    name: DataTypes.TEXT,
    genre: {
      type:DataTypes.ENUM('a', 'b'),
      comment: 'Genre of the foo',
    }
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  await sequelize.sync({ alter: true });

  console.log(await Foo.create({ name: 'TS foo' }));
  expect(await Foo.count()).to.equal(1);
}
