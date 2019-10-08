'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #11467
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const Project = sequelize.define('tst_project', {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        text: {
            type: new Sequelize.VIRTUAL(Sequelize.STRING, ['title', 'description']),
            get: function() {
                return this.get('title') + ': ' + this.get('description');
            }
        }
    });
    const Task = sequelize.define('tst_task', {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        deadline: Sequelize.DATE,
        text: {
            type: new Sequelize.VIRTUAL(Sequelize.STRING, ['title', 'id']),
            get: function() {
                return this.get('title') + ': ' + this.get('id');
            }
        }
    });
    Task.belongsTo(Project, { foreignKey: 'tstProjectId', targetKey: 'id', as: 'Project' });

    await sequelize.sync();

    let project = await Project.create({ title: 'Project 1', description: 'Project 1 description' });
    let task = await Task.create({ tstProjectId: 1, title: 'Task 1', description: 'Task 1 description' });
    let results = await Task.findAll({
        attributes: ['id'],
        include: [{
            model: Project,
            attributes: ['id', 'text'],
            as: 'Project'
        }]
    });
    log("Test");
    log(results[0].get('Project').get('text'));
};
