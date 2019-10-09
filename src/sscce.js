'use strict';

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });

    const User = sequelize.define('User', { name: Sequelize.STRING, pass: Sequelize.STRING });
    const Foo = sequelize.define('Foo', { name: Sequelize.STRING, pass: Sequelize.STRING });
    User.belongsTo(Foo);

    await sequelize.sync();
  
    log(await User.findAll({
        attributes: [[ Sequelize.col('name'), 'username' ]],
        include: {
            model: Foo,
            attributes: [[ Sequelize.col('name'), 'fooname' ]]
        }
    }));
};
