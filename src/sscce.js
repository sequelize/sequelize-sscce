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
module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
  
  
    const User = sequelize.define('users', { 
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_name: DataTypes.STRING,
    });
    const Playlist = sequelize.define('playlists', { 
      playlist_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      playlist_title: DataTypes.STRING,
    });
    const UserPlaylist = sequelize.define('userPlaylist', { 
      user_id: {
        type: DataTypes.STRING,
        references: {
          model: User,
          key: 'user_id'
        }
      },
      playlist_id: {
        type: DataTypes.STRING,
        references: {
          model: Playlist,
          key: 'playlist_id'
        }
      }
    });
    User.belongsToMany(Playlist, { through: UserPlaylist });
    Playlist.belongsToMany(User, { through: UserPlaylist });
  
    await sequelize.sync();
    log(await User.create({user_id: '1', user_name: 'Frank'}))
    log(await Playlist.create({playlist_id: '1', playlist_title: 'Songs 1'}))
    log(await Playlist.create({playlist_id: '2', playlist_title: 'Songs 2'}))
    log(await Playlist.create({playlist_id: '3', playlist_title: 'Songs 3'}))
    log(await UserPlaylist.create({user_id: '1', playlist_id: '1'}))
    log(await UserPlaylist.create({user_id: '1', playlist_id: '3'}))
    log(await User.findByPk('1', {
        include: [
          {
            model: Playlist,
            where: {user_id: '1'},
            as: 'user_playlists',
            attributes: ['playlist_id', 'playlist_title'],
          },
        ],
      }))
};
