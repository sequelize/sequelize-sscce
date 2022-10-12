import {DataTypes, Model} from 'sequelize';
import {createSequelize6Instance} from '../setup/create-sequelize-instance';
import {expect} from 'chai';
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
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Bar extends Model {
    public id!: number;
  }

  class Baz extends Model {
    public id!: number;
  }

  class Foo extends Model {
    public id!: number;
    public Bar?: Bar;
    public Baz?: Baz[];
  }

  class BarBaz extends Model {
  }

  Foo.init({}, {
    sequelize,
    modelName: 'Foo',
  });

  Bar.init({
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Bar',
  });

  Baz.init({}, {
    sequelize,
    modelName: 'Baz',
  });

  BarBaz.init({}, {
    sequelize,
    modelName: 'BarBaz',
  });

  Foo.belongsTo(Bar, {as: 'Bar'});
  Bar.hasMany(Foo);

  Foo.belongsToMany(Baz, {as: 'Baz', through: BarBaz});
  Baz.belongsToMany(Foo, {as: 'Foo', through: BarBaz});

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({force: true});
  expect(spy).to.have.been.called;

  // Objective of the tests: use a top level where with a limit AND without `duplication: false`

  const [baz1, baz2] = await Baz.bulkCreate([{id: 1}, {id: 2}]);
  const [bar1, bar2] = await Bar.bulkCreate([{id: 1, name: 'first'}, {id: 2, name: 'second'}])
  const [foo1, foo2, foo3] = await Foo.bulkCreate([
    {id: 1, BarId: bar2.id},
    {id: 2, BarId: bar1.id},
    {id: 3, BarId: bar1.id},
  ]);
  await BarBaz.bulkCreate([
    {FooId: foo1.id, BazId: baz1.id},
    {FooId: foo2.id, BazId: baz1.id},
    {FooId: foo3.id, BazId: baz1.id},
    {FooId: foo3.id, BazId: baz2.id},
  ]);

  // Final objective : get list of Foo with Bar's name "first" and include the full list of its Baz

  // Case without limits: works fine
  let match = await Foo.findAll({
    where: {
      '$Bar.name$': 'first'
    },
    include: [
      'Bar',
      'Baz',
    ],
  });

  expect(match.length).to.equal(2);
  expect(match[0].id).to.equal(2);
  expect(match[1].id).to.equal(3);
  expect(match[1].Baz?.length).to.equal(2);

  // The expected behavior, replacing the top-level request by a where in the association (id: 1 <=> name: 'first')
  match = await Foo.findAll({
    include: [
      {association: 'Bar', where: {id: 1}},
      'Baz',
    ],
    limit: 2
  });

  expect(match.length).to.equal(2);

  match = await Foo.findAll({
    where: {
      '$Bar.name$': 'first'
    },
    include: [
      'Bar',
      {association: 'Baz', duplicating: false},
    ],
    limit: 2
  });
  expect(match.length).to.equal(2);
  // Here we only have one Baz, because of the limit done before merging rows
  // This is the reason why `duplication: false` is not an option
  expect(match[1].Baz?.length).to.equal(1);

  // We then test without `duplicating: false` and here it fails
  match = await Foo.findAll({
    where: {
      '$Bar.name$': 'first'
    },
    include: [
      'Bar',
      {association: 'Baz'},
    ],
    limit: 2
  });
  expect(match.length).to.equal(2);
}
