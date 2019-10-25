'use strict';
module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ logQueryParameters: true });

    const Foo = sequelize.define('Foo', { name: DataTypes.STRING }, { timestamps: false });
    await sequelize.queryInterface.createTable('Foos', {
        id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        name: {
            type: DataTypes.TEXT,
            // Doesn't work
            unique: { args: true, msg: "Custom message doesn't work" }
        }
    });
    await Foo.create({ name: 'foo' });
    await Foo.create({ name: 'foo' });
    console.log('Unique constraint DID NOT work, otherwise an error would have been thrown above...\n');

    const Bar = sequelize.define('Bar', { name: DataTypes.STRING }, { timestamps: false });
    await sequelize.queryInterface.createTable('Bars', {
        id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        name: {
            type: DataTypes.TEXT,
            // Works
            unique: true
        }
    });
    try {
        await Bar.create({ name: 'bar' });
        await Bar.create({ name: 'bar' });
    } catch (e) {
        console.log(`Unique constraint works! Error was thrown as expected:`, e);
    }
};
