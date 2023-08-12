import { BelongsToGetAssociationMixin, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
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
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
    declare id?: string;
    declare name: string;
    declare BarId: ForeignKey<Bar['id']>;
    declare getBar: BelongsToGetAssociationMixin<Bar>;
  }
  class Bar extends Model<InferAttributes<Bar>, InferCreationAttributes<Bar>> {
    declare id?: string;
    declare name: string;
  }

  Foo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  Bar.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Bar',
  });

  Bar.hasMany(Foo);
  Foo.belongsTo(Bar);

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  const theBar = await Bar.create({ name: 'TS bar' });
  const theFoo = await Foo.create({ name: 'TS foo', BarId: theBar.id });

  // All is fine, BarId is correctly filled in the model, due to the create
  expect(await theFoo?.getBar()).to.not.be.null;

  // If have a function in my code that gives me the attributes and include automatically. But in some cases, I want to be
  // manually able to lazy load a specific relationship
  const theFreshFoo = await Foo.findOne({
    where: {
      name: theFoo.get("name")
    },
    attributes: ["name"]
  })
  // And when trying to load the relation, the relationship attribute is missing, so I simply get null
  expect(await theFreshFoo?.getBar()).to.not.be.null;
}
