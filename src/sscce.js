'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { assert } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: { timestamps: false }
  });

  const Bar = sequelize.define('Bar', {
    name: DataTypes.TEXT,
    fooId: DataTypes.INTEGER
  });

  const Foo = sequelize.define('Foo', {
    name: DataTypes.TEXT,
  }, {
    defaultScope: {
      include: [{model: Bar}],
    }
  });

  Bar.belongsTo(Foo, {
    foreignKey: 'fooId',
  });

  Foo.hasMany(Bar, {
    foreignKey: {
      name: 'fooId',
      allowNull: false,
    },
    onDelete: 'cascade',
  });


  await sequelize.sync();

  const foo = await Foo.create({name: 'foo'});

  const bar = await Bar.create({name:'bar', fooId: foo.id});

  const fooFromFind = await Foo.findByPk(foo.id);
  console.log(fooFromFind.toJSON())
  assert.ok(fooFromFind.Bars)
  assert.equal(fooFromFind.Bars[0].name, 'bar')

  // here I would expect the defaultScope to be used as well
  await foo.reload();

  console.log(foo.toJSON())
  assert.ok(foo.Bars)
  assert.equal(foo.Bars[0].name, 'bar')
};
