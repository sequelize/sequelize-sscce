'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    const sequelize = createSequelizeInstance({ benchmark: true });

    await sequelize.authenticate();

    const User = sequelize.define('User', {
        name: DataTypes.TEXT
    });

    await sequelize.sync();
  
    await User.create({
      name: '$user1'
    });
    await User.create({
      name: sequelize.fn('upper', 'user2')
    });

    try {
      await User.create({
        name: sequelize.fn('upper', '$user3')
      });
    } catch (error) {
      log(error.message);
    }

    const users = User.findAll({}, { plain: true });
    log(users);
};
