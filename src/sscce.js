'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    const sequelize = createSequelizeInstance({ benchmark: true });

    await sequelize.authenticate();

    const User = sequelize.define('User', {
        name: DataTypes.TEXT
    });

    await sequelize.sync();
  
    const u1 = await User.create({
      name: '$user1'
    });
    const u2 = await User.create({
      name: sequelize.fn('PGP_SYM_ENCRYPT', 'user2', 'my-key')
    });
    let u3;
    try {
      u3 = await User.create({
        name: sequelize.fn('PGP_SYM_ENCRYPT', 'user2', 'my-key')
      });
    } catch (error) {
      log(error.message);
      u3 = {};
    }
    log(u1.name);
    log(u2.name);
    log(u3.name);
};
