'use strict';
module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance();

    const Ship = sequelize.define('ship', {
        name: { type: DataTypes.STRING, unique: true }
    }, { timestamps: false });
    const Captain = sequelize.define('captain', {
        nickname: { type: DataTypes.STRING, unique: true }
    }, { timestamps: false });
    Ship.belongsToMany(Captain, { through: 'foobar', sourceKey: 'name', targetKey: 'nickname' });
    Captain.belongsToMany(Ship, { through: 'foobar', sourceKey: 'nickname', targetKey: 'name' });

    await sequelize.sync();

    const sparrow = await Captain.create({ nickname: 'Jack Sparrow' });
    const pearl = await Ship.create({ name: 'Black Pearl' });
    await sparrow.addShip(pearl);

    console.log("The static fetch works:");
    log(await Ship.findOne({ include: Captain }));

    console.log("The instance fetch doesn't work:");
    const ship = await Ship.findOne();
    log("ship:", ship);
    log("ship.getCaptains():", await ship.getCaptains());
};
