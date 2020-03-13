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
		benchmark: true
	});

	const Project = sequelize.define('project', { name: Sequelize.STRING });
	const ProjectStatusChanges = sequelize.define('projectStatusChange', { status: Sequelize.STRING });
	
	Project.hasMany(ProjectStatusChanges);
	ProjectStatusChanges.belongsTo(Project);
	
	const wait = ms => new Promise(r => setTimeout(r, ms));

	await sequelize.sync();

	await Project.create({ name: 'cool project 1' });
	await Project.create({ name: 'cool project 2' });
	await Project.create({ name: 'cool project 3' });
	await ProjectStatusChanges.create({ status: 'doing', projectId: 1 });
	await ProjectStatusChanges.create({ status: 'doing', projectId: 2 });
	await wait(500);
	await ProjectStatusChanges.create({ status: 'done', projectId: 1 });
	await wait(500);
	await ProjectStatusChanges.create({ status: 'still doing', projectId: 2 });
	await wait(500);
	await ProjectStatusChanges.create({ status: 'done', projectId: 2 });

	// I need to find all complete projects (the ones where latest projectStatusChange.status is 'done').
	log(await Project.findAll({
		include: {
			model: ProjectStatusChanges,
			// where: {
			// 	status: 'done'
			// },
			order: [['createdAt', 'DESC']],
			limit: 1
		},
		where: { '$project.projectStatusChange.status$': "done" },
		// order: [[ { model: ProjectStatusChanges }, 'createdAt', 'DESC']],
		// subQuery: false
	}));
};
