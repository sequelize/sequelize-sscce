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
    
    const Project = sequelize.define('Project', { name: DataTypes.STRING }, { paranoid: true });
    const User = sequelize.define('User', { name: DataTypes.STRING }, { paranoid: true });

    Project.belongsTo(User, { as: 'user' });
    User.hasOne(Project, { as: 'project' });
  
    await sequelize.sync();
  
    const user = await User.create({
        name: 'Test User',
        project: { name: 'Test Project' }
    }, {
      include: 'project'
    });

    const projectId = user.project.id;
  
    // IT PASSES
    if (projectId !== undefined) { 
      log('OK - Project saved with new ID')
    } else {
      log('FAIL - Project not saved')
    }
  
    const updatedUser = await user.set({
        name: 'User name',
        project: { name: 'Project name' }
    });
  
    if (user.project.id === undefined || user.project.id !== projectId) {
      log('FAIL - Our current Project instance is overrided, instead of updated')
    } else {
      log('OK - Project instance is updated')
    }
};
