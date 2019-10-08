'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #10710
  
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const thing = sequelize.define('thing', {
        id: {
            type: Sequelize.UUID,
            field: 'id',
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        name: {
            type: Sequelize.TEXT,
            field: 'name',
            unique: true,
        },
        nickname: {
            type: Sequelize.TEXT,
            field: 'nickname',
        }
    });

    await sequelize.sync();

    await thing.upsert({ name: 'john', nickname: 'johnjohn' });
    await thing.upsert({ name: 'john', nickname: 'johnjohn' });
};
