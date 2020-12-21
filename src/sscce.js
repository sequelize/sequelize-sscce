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
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Foo = sequelize.define('Foo', { name: DataTypes.TEXT });
    await sequelize.sync();
    log(await Foo.create({ name: 'foo' }));
    expect(await Foo.count()).to.equal(1);
  
  const Client = sequelize.create('Client', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lastname:  {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt:  {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  
  await sequalize.sync();
  log(await Client.create({name: 'Arturo', lastname: 'Tenorio'}));
  expect(await Client.count()).to.equal(1);
};
