'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class Team extends Model {}
  class Game extends Model {}
  class GameTeam extends Model {}

  Team.init({
    name: DataTypes.STRING
  },{
    sequelize,
    modelName: 'Team'
  });
 
  Game.init({
    name: DataTypes.STRING
  },{
    sequelize,
    modelName: 'Game'
  });

  GameTeam.init({},{
    sequelize,
    modelName: 'GameTeam',
    freezeTableName: true
  });

  Team.belongsToMany(Game, { through: GameTeam });
  Game.belongsToMany(Team, { through: GameTeam });
  GameTeam.belongsTo(Game);
  GameTeam.belongsTo(Team);
  Game.hasMany(GameTeam);
  Team.hasMany(GameTeam);

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  log(await Game.bulkCreate([
    { name: 'The Big Clash', Teams: [{ id: 1, name: 'The Martians' }, { id: 2, name: 'The Earthlings' }] },
    { name: 'Winter Showdown', Teams: [{ id: 1, name: 'The Martians' }, { id: 3, name: 'The Plutonians' }] },
    { name: 'Summer Beatdown', Teams: [{ id: 2, name: 'The Earthlings' }, { id: 3, name: 'The Plutonians' }] }
  ], { include: [{ model: Team, updateOnDuplicate: ['name'] }, { model: GameTeam, updateOnDuplicate: ['GameID','TeamId']}] }));
  expect(await GameTeam.count()).to.equal(6);

};
