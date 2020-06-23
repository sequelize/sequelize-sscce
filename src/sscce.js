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
  await queryInterface.createTable('Users', {
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
    salt: {
      allowNull: false,
      type: Sequelize.BLOB,
    },
    hash: {
      allowNull: false,
      type: Sequelize.BLOB,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  
  // Here, the unique constraint on email gets removed
  await queryInterface.addColumn('Foo', 'discordId', {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true,
  });
  await queryInterface.changeColumn('Foo', 'email', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.changeColumn('Foo', 'hash', {
    type: Sequelize.BLOB,
    allowNull: true,
  });
  await queryInterface.changeColumn('Foo', 'salt', {
    type: Sequelize.BLOB,
    allowNull: true,
  });
  
  // attempting to re add unique constraints
  await queryInterface.changeColumn('Foo', 'name', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });
  await queryInterface.changeColumn('Foo', 'email', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
  
  // load model
  const Foo = sequelize.define('Foo', {
    username: {
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
    salt: {
      type: DataTypes.BLOB,
      allowNull: true,
      validate: {
        len: [1, 256],
      },
    },
    hash: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    discordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    validate: {
      ensureCredentials() {
        if ((!this.email || !this.hash || !this.salt) && !this.discordId) {
          throw new Error('Incomplete login credentials. Requires social login or email/password.');
        }
      },
    },
  });

  // test expected behavior
  log(await Foo.create({ email: "test@localhost", salt: Buffer.from([0]), hash: Buffer.from([0]), name: 'foo' }));
  log(await Foo.create({ discordId: "12341234", name: 'foo2' }));
  expect(await Foo.count()).to.equal(2);
  try {
    log(await Foo.create({ discordId: "12341234", name: 'foo' }));
    assert.fail();
  }
  catch (e) {
    expect(e.name).to.equal("SequelizeUniqueConstraintError");
  }
  try {
    log(await Foo.create({ email: "test@localhost", salt: Buffer.from([0]), hash: Buffer.from([0]), name: 'foo3' }));
    assert.fail();
  }
  catch (e) {
    expect(e.name).to.equal("SequelizeUniqueConstraintError");
  }
};
