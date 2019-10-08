'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #5193
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const User = sequelize.define('User', { name: Sequelize.STRING }, { timestamps: false });
    const Task = sequelize.define('Task', { name: Sequelize.STRING }, { timestamps: false });
    Task.removeAttribute('id'); // This line is causing all the problems

    Task.belongsTo(User);
    User.hasMany(Task);

    await sequelize.sync();

    await User.create({
        name: 'Foo',
        Tasks: [{ name: 'Bar' }, { name: 'Baz' }, { name: 'Qux' }]
    }, { include: Task });

    log(await User.findAll({ include: Task }));
};
