import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, DialectOptions } from '@sequelize/core';
import { Attribute, NotNull } from '@sequelize/core/decorators-legacy';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
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
      underscored: true
    },
  });

  class Parents extends Model {};
  Parents.init(
    {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      name: DataTypes.TEXT,
    },
    {sequelize},
  );

  class Children extends Model {};
  Children.init(
      {
          id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          parentId: {
              type: DataTypes.INTEGER,
              references: {
                  model: Parents,
                  key: 'id'
              }
          }
      },
      {sequelize}

  )

  class GrandChildren extends Model {};
  GrandChildren.init(
    {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
       parentId: {
          type: DataTypes.INTEGER,
          references: {
              model: Children,
              key: 'id'
          }
      }
    },
      {sequelize}
  );

  Parents.hasMany(Children)
  Children.belongsTo(Parents)
  Children.hasMany(GrandChildren)
  GrandChildren.belongsTo(Children)

    // You can use sinon and chai assertions directly in your SSCCE.
    const spy = sinon.spy();
    sequelize.afterBulkSync(() => spy());
    await sequelize.sync({ force: true });
    expect(spy).to.have.been.called;

    const created = await Parents.create()
    const {rows, count} = await Parents.findAndCountAll({
        include: {
          model: Children,
            required: false,
            include: [{
                model: GrandChildren,
                required: true,
            }]
        },
        limit: 1
    })

    console.log(rows);
    expect(created).to.not.be.undefined;
    expect(created).to.not.be.null;
    expect(count).to.equal(1);
    expect(rows.length).to.equal(1);
}
