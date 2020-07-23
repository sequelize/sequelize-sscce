'use strict';

const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const createSequelizeInstance = require('./utils/create-sequelize-instance');

const log = require('./utils/log');

// const { expect } = require('chai');

async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('tasks', 'status', { status: Sequelize.ENUM, values: ['new','in_progress','done'], allowNull: false, defaultValue: 'new' });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('tasks', 'status', { status: Sequelize.STRING, allowNull: false, defaultValue: '' });
}

module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: { timestamps: false }
    });

    const Task = sequelize.define('Task', { status: DataTypes.STRING, allowNull: false, defaultValue: '' }, { tableName: 'tasks' });
    await sequelize.sync();
    
    // The problem is with a migration
    const queryInterface = sequelize.getQueryInterface();
    
    await up(queryInterface, Sequelize);
  
    await down(queryInteface, Sequelize);
};
