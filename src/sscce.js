'use strict';

// Require the necessary things from Sequelize
const {Sequelize, Op, Model, DataTypes} = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const {expect} = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const errorMessage = 'username or birthay not set';
  class User extends Model {}
  User.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user',
    validate: {
      usernameAndBirthdayMustBeSet() {
        if (!this.username || !this.birthday) {
          throw new Error(errorMessage);
        }
      }
    }
  });

  await sequelize.sync();
  const user = await User.create({
    username: 'foo',
    birthday: new Date(1980, 6, 20)
  });

  let err;
  try {
    await User.update({username: 'bar'}, {where: {username: user.username}});
  } catch (_err) {
    err = _err;
  }
  expect(err).to.exist;
  expect(err).to.be.instanceOf(Sequelize.ValidationError);
};
