'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const Foo = sequelize.define('foo', { name: Sequelize.STRING }, { timestamps: false });
    const Bar = sequelize.define('bar', { name: Sequelize.STRING }, { timestamps: false });

    Foo.hasMany(Bar, { foreignKey: 'fooId' });
    Bar.belongsTo(Foo, { foreignKey: 'fooId' });

    await sequelize.sync();

    await Foo.create({
        name: 'Foo 1',
        bars: [
            { name: 'Bar 1' },
            { name: 'Bar 2' },
            { name: 'Bar 3' },
            { name: 'Bar 4' },
            { name: 'Bar 5' }
        ]
    }, { include: Bar });
    await Foo.create({ name: 'Foo 2' });

    // Gives 6 and 5 but expected 2 and 1
    log(await Foo.count({ include: { model: Bar } }));
    log(await Foo.count({ include: { model: Bar, required: true } }));
};
