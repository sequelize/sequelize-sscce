'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

    const Animal = sequelize.define('Animal', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER
    });
    const Kingdom = sequelize.define('Kingdom', {
        name: DataTypes.STRING
    });
    const AnimalKingdom = sequelize.define('AnimalKingdom', {
        id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        relation: DataTypes.STRING,
        mutation: DataTypes.BOOLEAN
    });
    Kingdom.belongsToMany(Animal, { through: AnimalKingdom });
    Animal.belongsToMany(Kingdom, { through: AnimalKingdom });

    await sequelize.sync();
    const [a1, a2, a3, a4] = await Animal.bulkCreate([
        { name: 'Dog', age: 20 },
        { name: 'Cat', age: 30 },
        { name: 'Peacock', age: 25 },
        { name: 'Fish', age: 100 }
    ]);
    const [k1, k2, k3, k4] = await Kingdom.bulkCreate([
        { name: 'Earth' },
        { name: 'Water' },
        { name: 'Wind' },
        { name: 'Space' }
    ]);
    await k1.addAnimals([a1, a2]);
    await k2.addAnimals([a4]);
    await k3.addAnimals([a3]);

    const kingdoms = await Kingdom.findAll({
        group: ['Kingdom.id'],
        attributes: {
            include: [
                'Kingdom.id',
                [
                    Sequelize.fn('COUNT', Sequelize.col('Animals.id')),
                    'AnimalCount'
                ]
            ]
        },
        include: {
            model: Animal,
            attributes: [],
            through: { attributes: [] },
            duplicating: false
        }
    });

    for (const kingdom of kingdoms) {
        console.log(`Now checking kingdom '${kingdom.name}':`);
        console.log(`kingdom.dataValues.AnimalCount should exist: ${kingdom.dataValues.AnimalCount ? 'ok' : 'not ok'}`);
        console.log(`kingdom.dataValues.Animals should not exist: ${kingdom.dataValues.Animals ? 'not ok' : 'ok'}`);
    }

};