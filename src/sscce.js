'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
    const sequelize = createSequelizeInstance({
      logQueryParameters: true,
      benchmark: true,
      define: {
          timestamps: false // For less clutter in the SSCCE
      },
      dialect: 'sqlite',
      storage: ':memory:'
    });
  
    const User = sequelize.define('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING
      }
    });

    const Task = sequelize.define('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: 'Untitled Task',
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: '',
      }
    });

    const Participation = sequelize.define('participates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    })

    User.belongsToMany(Task, {
      through: Participation,
      as: { singular: 'user', plural: 'users' },
    });

    Task.belongsToMany(User, {
      through: Participation,
      as: { singular: 'task', plural: 'tasks' },
    });

    await sequelize.sync();
    const result = await User.findAll({
      include: [Task.associations.tasks],
      through: {
        attributes: ['role']
      }
    })
    log(result);
};
