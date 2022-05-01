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

  class Foo extends Model {
    declare name: string;
  }

  Foo.init({
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  // Create a new instance with "initial name"
  const instance = new Foo({ name: "initial name" });

  // Start an INSERT INTO, but don't await for it yet
  const insertIntoPromise = instance.save();

  // Wait until next frame when the INSERT INTO has properly started (but not finished)
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 0);
  });

  // Set the name to "new name" while the INSERT INTO is still running
  instance.name = "new name";

  // As expected: instance.changed("name") === true
  console.log({
    'instance.name': instance.name,
    'instance.changed("name")': instance.changed("name")
  });

  // Now we wait until the previous INSERT INTO is finished
  await insertIntoPromise;

  // Unexpectedly: instance.changed("name") === false (despite it being "new name" in this instance and "initial name" in the database)
  console.log({
    'instance.name': instance.name,
    'instance.changed("name")': instance.changed("name")
  });

  // Try to UPDATE with "new name" - but this doesn't do anything, because instance.changed("name") === false
  await instance.save();

  // The instance in memory has "new name"
  expect(instance.name).to.equal("new name");

  // The instance in the database unexpectedly still has "initial name"
  expect((await Foo.findOne())?.name).to.equal("new name"); // AssertionError: expected 'initial name' to equal 'new name'
}
