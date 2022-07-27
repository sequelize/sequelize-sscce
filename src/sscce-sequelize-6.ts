import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([ 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

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

  class Setting extends Model {}

  Setting.init({
    name: DataTypes.TEXT,
    value: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Setting',
  });

  await sequelize.sync({ force: true });
  console.log(await Setting.create({ name: 'title', value: 'test' }));
  const setting = await Setting.findOne()
  expect(setting?.get().value).to.equal('test');

}
