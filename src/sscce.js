'use strict';
module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance();

    const Person = sequelize.define('person', { name: DataTypes.STRING }, { timestamps: false });
    Person.hasOne(Person, { as: 'father' });
    Person.hasOne(Person, { as: 'mother' });

    const alice = await Person.create({ name: 'Alice' });
    const anna = await Person.create({ name: 'Anna' });
    const alan = await Person.create({ name: 'Alan' });
    alice.setFather(alan);
    alice.setMother(anna);

    log(await Person.findOne({
        include: ['father', 'mother']
    }));
};
