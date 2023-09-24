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
    underscored: true,
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
      references: { model: 'foos' },
    },
    data: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'bar',
    underscored: true,
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
      insert into foos (
        id, name
      )
      select
        i::integer,
        md5(random()::text)
      from generate_series(1, 10000000) s(i)
    `),
    sequelize.query(`
      insert into bars (
        id, foo_id, data
      )
      select
        i::integer,
        i::integer,
        md5(random()::text)
      from generate_series(1, 10000000) s(i)
    `),
  ]);
  
  {
    console.log("TEST 1")
    const offset = 0;
    const limit = 10;
    const result = await Foo.findAll({
      logging: console.log,
      benchmark: true,
      limit,
      offset,
      where: { id: { [Op.between]: [345, 5678] } },
      include: {
        model: Bar,
        required: true,
        where: { id: { [Op.between]: [2345, 8678] } }
      },
    });
  }
  
  {
    console.log("TEST 2")
    const result = await sequelize.query(
      `SELECT "foo".*, "bars"."id" AS "bars.id", "bars"."foo_id" AS "bars.fooId", "bars"."data" AS "bars.data" FROM (
        SELECT "foo"."id", "foo"."name" FROM "foos" AS "foo"
          WHERE "foo"."id" BETWEEN 345 AND 5678 AND
          (
            SELECT "foo_id" FROM "bars" AS "bars"
              WHERE ("bars"."id" BETWEEN 2345 AND 8678 AND "bars"."foo_id" = "foo"."id") LIMIT 1
          ) IS NOT NULL
          LIMIT 10 OFFSET 0
        ) AS "foo"
      INNER JOIN "bars" AS "bars" ON "foo"."id" = "bars"."foo_id" AND "bars"."id" BETWEEN 2345 AND 8678;`,
      {
        logging: console.log,
        benchmark: true,
      }
    );
  }
  
  {
    console.log("TEST 3")
    const result = await sequelize.query(
      `SELECT "foo".*, "bars"."id" AS "bars.id", "bars"."foo_id" AS "bars.fooId", "bars"."data" AS "bars.data" FROM (
        SELECT "foo"."id", "foo"."name" FROM "foos" AS "foo"
          WHERE "foo"."id" BETWEEN 345 AND 5678 AND
          EXISTS (
            SELECT "foo_id" FROM "bars" AS "bars"
              WHERE ("bars"."id" BETWEEN 2345 AND 8678 AND "bars"."foo_id" = "foo"."id") LIMIT 1
          )
          LIMIT 10 OFFSET 0
        ) AS "foo"
      INNER JOIN "bars" AS "bars" ON "foo"."id" = "bars"."foo_id" AND "bars"."id" BETWEEN 2345 AND 8678;`,
      {
        logging: console.log,
        benchmark: true,
      }
    );
  }
}
