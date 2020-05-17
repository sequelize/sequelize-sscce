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
  
    const User = sequelize.define('User', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      }
    });
  
    const Room = sequelize.define('Room', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.TEXT
      }
    });
  
    const Subscription = sequelize.define('Subscription', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      lastSeen: {
        type: DataTypes.DATE
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Room',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
    },
    });
  
    // set association
    User.belongsToMany(Room, {
      through: 'Subscription',
      foreignKey: 'userId',
      as: 'rooms'
    });
    
    await sequelize.sync();
  
    let resAll = await Promise.all([
      User.create({ name: 'Jhon' }),
      Room.create({ description: 'for discussion' })
    ]);
  
    let resSubscription await Subscription.create([{ userId: resAll[0].id, roomId: resAll[1].id, lastSeen: new Date() }]);
  
    log(await Subscription.bulkCreate([{ id: resSubscription.id, userId: resAll[0].id, roomId: resAll[1].id, lastSeen: new Date()  }], { updateOnDuplicate: ['lastSeen'] }));
    //expect(await Foo.count()).to.equal(1);
};
