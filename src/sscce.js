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
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

    const User = sequelize.define('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: DataTypes.STRING
    }, { underscored: true });

    const Project = sequelize.define('projects', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, { underscored: true });

    User.belongsTo(Project);
  
    await sequelize.sync();
    await Project.bulkCreate([{ name: 'test 1' }, { name: 'test 2' }]);

    // The outcome of this SSCCE in Sequelize v4 is very different from v5!

    // This will not work and project_id will not be set (NULL)
    await User.create({ first_name: 'firstUser', last_name: 'firstUser', project_id: 1 });
    // This will work and it will set project_id to 2
    await User.create({ first_name: 'secondUser', last_name: 'secondUser', projectId: 2 });

    log(await Project.findAll());
    log(await User.findAll({ include: Project }));
};
