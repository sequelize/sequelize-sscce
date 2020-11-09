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
  
    const UserModel = sequelize.define('user', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
    });

    const HangModel = sequelize.define('hang', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
    });

    const HangUsers = sequelize.define('HangUsers', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      hangId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        references: {
          model: HangModel,
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
      rsvp: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [ 'pending', 'joined' ],
            msg: 'The rsvp provided is invalid',
          },
        },
      },
    });

    UserModel.hasMany(HangUsers, { as: 'invitations' });
    HangModel.hasMany(HangUsers, { as: 'invites' });

    UserModel.belongsToMany(HangModel, { through: HangUsers });
    HangModel.belongsToMany(UserModel, { through: HangUsers });
  
    const user = await UserModel.create();
    const hang = await HangModel.create();
    await hang.addUser(user, { through: { rvsp: 'joined' } });
  
    await sequelize.sync();
    log(await hang.addUser(user, { through: { rvsp: 'joined' } }));
};
