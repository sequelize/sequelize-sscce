import { DataTypes, Model } from '@sequelize/core';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([ 'postgres', 'postgres-native']);

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

  class User extends Model {}

  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  const attributes = ['name'];
  const created = await User.create({ name: 'Foo', password: 'pass' }, {returning: attributes});
  console.log(created);
  expect(created.name).to.equal('Foo);
  expect(created.password).to.be.undefined;
  const updatedWithChange = await User.update({name:'Bar'}, {where: {id: created.id}, returning: attributes, individualHooks: true});
  console.log(updatedWithChange)
  expect(updatedWithChange[1][0].name).to.equal('Bar');
  expect(updatedWithChange[1][0].password).to.be.undefined;
  const updatedNoChange = await User.update({name:undefined}, {where: {id: created.id}, returning: attributes, individualHooks: true});
  console.log(updatedNoChange)
  expect(updatedWithChange[1][0].name).to.equal('Bar');
  expect(updatedWithChange[1][0].password).to.be.undefined;
  
  //expect(await Foo.count()).to.equal(1);
  await User.up
}
