'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect, assert } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
      logQueryParameters: true,
      benchmark: true,
      define: {
          timestamps: false // For less clutter in the SSCCE
      }
  });
  
  let queryInterface = sequelize.getQueryInterface();
  console.log("Creating table...");
  await queryInterface.createTable('Foos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
  });
  
  // Here, the unique constraint on email gets removed
  console.log("Performing migration 1...");
  await queryInterface.addColumn('Foos', 'discordId', {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true,
  });
  await queryInterface.changeColumn('Foos', 'email', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  
  // attempting to re add unique constraints
  console.log("Performing migration 2...");
  await queryInterface.changeColumn('Foos', 'name', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });
  await queryInterface.changeColumn('Foos', 'email', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
  
  // load model
  const Foo = sequelize.define('Foo', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 255],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          args: [
            {
              require_tld: process.env.NODE_ENV === 'production',
            },
          ],
        },
      },
    },
    discordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    validate: {
      ensureCredentials() {
        if (!this.email && !this.discordId) {
          throw new Error('Incomplete login credentials. Requires social login or email/password.');
        }
      },
    },
  });

  // test expected behavior
  console.log("Checking for correct bahavior");
  log(await Foo.create({ email: "test@localhost", name: 'foo' }));
  log(await Foo.create({ discordId: "12341234", name: 'foo2' }));
  expect(await Foo.count()).to.equal(2);
  
  let success = false;
  try {
    log(await Foo.create({ discordId: "9834123434", name: 'foo' }));
    success = true;
  }
  catch (e) {
    expect(e.name).to.equal("SequelizeUniqueConstraintError");
  }
  if (success) {
    assert.fail();
  }
  
  success = false;
  try {
    log(await Foo.create({ email: "test@localhost", name: 'foo3' }));
    success = true;
  }
  catch (e) {
    expect(e.name).to.equal("SequelizeUniqueConstraintError");
  }
  if (success) {
    assert.fail();
  }
};
