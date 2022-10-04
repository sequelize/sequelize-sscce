import { DataTypes, Model, QueryTypes } from 'sequelize';
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
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;
  
  const result1 = await sequelize.query(
    `
      INSERT INTO "Foos" (id, name)
      VALUES          (1, 'steve')
      ON CONFLICT (id) DO UPDATE
      SET name='steve'
      RETURNING id, name
    `,
    {
      type: QueryTypes.RAW,
    }
  );
  
  const result2 = await sequelize.query(
    `
      -- HAX
      INSERT INTO "Foos" (id, name)
      VALUES          (1, 'steve')
      ON CONFLICT (id) DO UPDATE
      SET name='steve'
      RETURNING id, name
    `,
    {
      type: QueryTypes.RAW,
    }
  );

  console.log(result1, result2);
  expect(result1).to.deep.equal(result2);
}
