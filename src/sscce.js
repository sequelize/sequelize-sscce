'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function () {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

    const Player = sequelize.define(
        'players',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            name: Sequelize.STRING,
            teamId: Sequelize.INTEGER,
        }
    );

    const Child = sequelize.define(
        'children',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            name: Sequelize.STRING,
            playerId: Sequelize.INTEGER,
        }
    );

    const Team = sequelize.define(
        'teams',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            name: Sequelize.STRING,
            country: Sequelize.STRING,
        }
    );

    Player.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });
    Player.hasMany(Child, { as: 'children', foreignKey: 'playerId' });

    Player.addScope('children', {
        include: [
            {
                model: Child.unscoped(),
                as: 'children',
            },
        ],
    });
    Player.addScope('team', {
        include: [
            {
                model: Team.unscoped(),
                as: 'team',
            },
        ],
    });
    Player.addScope('teamByName', name => ({
        include: [{ model: Team.unscoped(), as: 'team', where: { name } }],
    }));

    await sequelize.sync({ force: true });

    const roma = await Team.create({ id: 1, name: 'Roma' });
    const liverpool = await Team.create({ id: 2, name: 'Liverpool' });
    await Player.create({ id: 1, name: 'Franchesko Totti', teamId: roma.id });
    await Player.create({ id: 2, name: 'Mohamed Salah', teamId: liverpool.id });

    // Appears that this query somehow pollutes the scope for the next query.
    // If we change the order of 'children' and 'team' scopes or remove the 'children'
    // scope the problem disappears.
    await Player.scope(['children', 'team', { method: ['teamByName', 'Roma'] }]).findAll({
        where: {},
    });

    const players = await Player.scope(['team']).findAll({ where: {} });
    console.log(players.map(p => p.name));
    expect(players).to.have.length(2);
};
