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
      timestamps: false // For less clutter in the SSCCE
    }
  });

  const User = sequelize.define('user', {
    name: DataTypes.STRING
  });
  const Role = sequelize.define('role', {
    name: DataTypes.STRING
  });
  User.Role = User.hasMany(Role)

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await User.create({
    name: 'parent',
    roles: [{
      name: 'role 1'
    }, {
      name: 'role 2'
    }]
  }, {
    include: [{ association: User.Role }]
  }))

  const users = await User.findAll()
  const roles = await Role.findAll()
  expect(users).to.have.length(1, 'Created a user')
  expect(roles).to.have.length(2, 'Created a role')

  const user = users[0]
  const rolesToBeRemoved = await user.getRoles()
  expect(rolesToBeRemoved).to.have.length(2, 'User has roles')

  await user.removeRoles(rolesToBeRemoved)
  //await Promise.all(rolesToBeRemoved.map(role => role.destroy()))

  expect(await user.getRoles()).to.have.length(0, 'User has no roles')
  expect(await Role.findAll()).to.have.length(0, 'Roles removed from database')
};
