'use strict';

module.exports = async function(createSequelizeInstance, log) {
    if (process.env.DIALECT !== "postgres") return;
  
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    const sequelize = createSequelizeInstance({ benchmark: true });

    await sequelize.authenticate();

    const MyModel = sequelize.define('MyModel', {
        text: DataTypes.TEXT,
        json: DataTypes.JSONB
    });

    await sequelize.sync();

    const text = 'RETURNING *';
    await User.upsert({ 
        text, 
        // will throw exception:
        //json: '{"foo":"RETURNING *"}' 
    });
    const models = await User.findAll();
    log(`${text} != ${models[0].text}`); 
};
