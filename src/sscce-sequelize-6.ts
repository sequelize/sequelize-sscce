import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    minifyAliases: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model {
    name!: string
  }

  Foo.init({
    name: {field: "my_name", type: DataTypes.TEXT},
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  console.log(await Foo.create({ name: 'Foo1' }));
  console.log(await Foo.create({ name: 'Foo2' }));
  let thisWorks = (await Foo.findAll({subQuery: false, order: sequelize.literal(`"Foo".my_name`)})).map(f => f.name);
  expect(thisWorks[0]).to.equal("Foo1")

  let thisDoesntWork = (await Foo.findAll({attributes: {include: [[sequelize.literal(`"Foo".my_name`), "customAttribute"]]}, subQuery: true, order: ["customAttribute"]})).map(f => f.name);
  expect(thisDoesntWork[0]).to.equal("Foo1")

  // let thisDoesntWork = (await Foo.findAll({subQuery: true, order: sequelize.literal(`"Foo".my_name`)})).map(f => f.name);
  // expect(thisDoesntWork[0]).to.equal("Foo1")
}
