'use strict';
module.exports = async function (createSequelizeInstance, log) {

    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();


    const User = sequelize.define('User', {
        name: DataTypes.TEXT,
        pass: DataTypes.TEXT
    });
    const Foo = sequelize.define('Foo', {
        name: DataTypes.TEXT,
        pass: DataTypes.TEXT
    });
    
    User.belongsTo(Foo);
    Foo.hasOne(User);

    await sequelize.sync();

    log(await User.findAll({
        include: [{
            model: Foo
        }],
        limit: 2,
        offset: 0,
        order: [['id', 'DESC']]
    }));
};