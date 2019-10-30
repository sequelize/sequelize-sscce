'use strict';

module.exports = async function(createSequelizeInstance, log) {
    
    const { Sequelize, DataTypes } = require('sequelize');

    // Create an instance, using the convenience function instead
    // of the usual instantiation with `new Sequelize(...)`
    const sequelize = createSequelizeInstance({ benchmark: true });
  
    // I will create a many-to-many relationship between User and Project 

    const User = sequelize.define('User', {
        name: DataTypes.TEXT
    });
  
    const Project = sequelize.define('Project', {
        name: DataTypes.TEXT
    });
  
    const UserProjects = sequelize.define('UserProject', {
        status: DataTypes.STRING
    });
  
    User.belongsToMany(Project, { through: UserProjects })
    Project.belongsToMany(User, { through: UserProjects })
  
    await sequelize.sync();
  
    // Creating a user and 2 projects
  
    const user = await User.create({ name: 'foo' });
    const project = await Project.create({ name: 'bar' });
    const project2 = await Project.create({ name: 'baz' });
  
    user.addProject(project, { through: { status: 'started' }})
    user.addProject(project2, { through: { status: 'completed' }})
  
    await sequelize.sync();
  
    // Without the 'as' property I will get the default model name for the through table
    log("Through without 'as'...");
    log(await User.findAll({
      include: [{
        model: Project,
        through: {
          attributes: ['status'],
        }
      }]
    }))
  
   // Adding the 'as' property I will set the name for the through table
   log("Through with 'as'....");
   log(await User.findAll({
      include: [{
        model: Project,
        through: {
          as: 'myProject',
          attributes: ['status'],
        }
      }]
    }))
};
