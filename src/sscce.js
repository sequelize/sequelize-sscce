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
        }
    });
  
    const User = sequelize.define('users', { username: DataTypes.STRING });
    const Task = sequelize.define('tasks', {
        name: {
            type: DataTypes.STRING,
            defaultValue: 'Untitled Task',
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: '',
        }
    });
    const Participation = sequelize.define('participates', { role: DataTypes.STRING });

    User.belongsToMany(Task, { through: Participation });
    Task.belongsToMany(User, { through: Participation });

    await sequelize.sync();

    const u = await User.create({ username: 'foo' });
    const t = await Task.create({ description: 'bar' });
    await u.setTasks([t.id]);

    log(await User.findAll({
        include: Task,
        through: { attributes: ['role'] }
    }));
};
