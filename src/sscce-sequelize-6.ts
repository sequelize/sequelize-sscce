import { DataTypes, Model, QueryTypes, Op } from 'sequelize';
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

  class Foo extends Model {}
  Foo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'foo',
  });

  class Bar extends Model {}
  Bar.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fooId: {
      type: DataTypes.INTEGER,
    },
    data: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'bar',
  });

  Foo.hasMany(Bar);
  Bar.belongsTo(Foo);

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  await Promise.all([
    sequelize.query(`
      insert into foo (
        id, name
      )
      select
        i::integer,
        md5(random()::text)
      from generate_series(1, 1000000) s(i)
    `),
    sequelize.query(`
      insert into bar (
        id, fooId, data
      )
      select
        i::integer,
        i::integer,
        md5(random()::text)
      from generate_series(1, 1000000) s(i)
    `),
  ]);
  
  const offset = 0;
  const limit = 10;
  const result = await Foo.findAll({
    logging: console.log,
    benchmark: true,
    // distinct: true,
    limit,
    offset,
    include: {
      model: Bar,
      required: true,
      where: { id: { [Op.gt]: 1 } }
    },
  });

  console.log(result);
}
