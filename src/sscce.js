'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
    if (process.env.DIALECT !== "postgres") return;
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    const Foo = sequelize.define('Foo', {
      id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
      },
      name: DataTypes.TEXT
    }, {
      timestamps: true,
      createdAt: 'CreatedAt',
      updatedAt: 'UpdatedAt',
    });
    const Bar = sequelize.define('Bar', {
      id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
      },
      name: DataTypes.TEXT
    }, {
      timestamps: true,
      createdAt: 'CreatedAt',
      updatedAt: 'UpdatedAt',
    });
    const FooBar = sequelize.define('FooBar', {
      FooId: {
        primaryKey: true,
        type: DataTypes.UUID,
        references: {
          model: 'Foos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      BarId: {
        primaryKey: true,
        type: DataTypes.UUID,
        references: {
          model: 'Bars',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, {
      timestamps: true,
      createdAt: 'CreatedAt',
      updatedAt: 'UpdatedAt',
    });
    Foo.belongsToMany(Bar, {
      through: FooBar,
    });
    Bar.belongsToMany(Foo, {
      through: FooBar,
    });
    FooBar.belongsTo(Foo);
    FooBar.belongsTo(Bar);
    await sequelize.sync();
    const foosData = [{ name: 'foo1' }, { name: 'foo2' }];
    const barsData = [{name: 'bar1'}, {name: 'bar2'}];
    const foos = await Foo.bulkCreate(foosData);
    const bars = await Bar.bulkCreate(barsData);
    const fooBarsData = foos.flatMap(foo => bars.map(bar => ({
      FooId: foo.id,
      BarId: bar.id,
    })));
    const fooBars = log(await fooBarsData.bulkCreate(fooBarsData, {
      updateOnDuplicate: ['UpdatedAt'],
    }));
    expect(fooBars.count()).toEqual(4);
};
