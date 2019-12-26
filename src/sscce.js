'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ logQueryParameters: true, benchmark: true });
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable('Person', {
        name: DataTypes.STRING,
        isBetaMember: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        foo: DataTypes.INTEGER
    });

    await queryInterface.addColumn('Person', 'petName', { type: DataTypes.STRING });
    // await queryInterface.changeColumn('Person', 'petName', { type: DataTypes.TEXT('medium') });
    // await queryInterface.changeColumn('Person', 'petName', { type: DataTypes.INTEGER });
    // await queryInterface.changeColumn('Person', 'foo', {
    //     type: DataTypes.FLOAT,
    //     defaultValue: 3.14,
    //     allowNull: false
    // });
    await queryInterface.removeColumn('Person', 'petName');

};