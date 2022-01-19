'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
      freezeTableName: true,
      underscored: true,
    }
  });

  const Foos = sequelize.define('Foos', { name: DataTypes.TEXT });
  
  const Bars = sequelize.define('Bars', { name: DataTypes.TEXT, disabled: DataTypes.BOOLEAN, });
  Bars.removeAttribute('id');
  
  Foos.hasMany(Bars, { foreignKey: 'fooId' });
  Bars.belongsTo(Foos, { foreignKey: 'fooId' });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;
  
  const myFoo = await Foos.create({ name: 'foo' });
  
  const myBar = await Bars.create({
    name: 'bar',
    fooId: myFoo.id,
    disabled: false,
  });
  
  const myBarNow = await Bars.findOne({
    where: {
      fooId: myFoo.id,
    },
  });
  
  // This is where it is failing
  await myBarNow.update({
    disabled: true,
  });
  
  const myBarNow2 = await Bars.findOne({ where: { id: myBar.id });

  expect(myBarNow2.disabled).to.equal(true);
};
