import { DataTypes } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres']);

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
  })

  // Create schemas
  await sequelize.createSchema('schema_a', {})
  await sequelize.createSchema('schema_b', {})

  // Table `users` within schema `schemaA`
  const User1 = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'users',
      schema: 'schema_a'
    }
  )

  // Create `files` within schema `schemaA` that belongs to `user`
  const File = sequelize.define(
    'File',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'files',
      schema: 'schema_a'
    }
  )

  File.belongsTo(User1, {
    as: 'file',
    foreignKey: 'fileId',
    constraints: true, // Set this to false and use the `User2` model and it will run work right.
  })

  // Table `user` within schema `schemaB`
  const User2 = sequelize.define( // Comment this model and use constraints with `belongsTo` and it will work just right.
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'users2',
      schema: 'schema_b'
    }
  )

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;
}
