'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #10914
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const Foo = sequelize.define("foo", {
        name: Sequelize.STRING
    }, {
        defaultScope: {
            // attributes: {
            //     include: ['a', 'b', 'c']
            // }
            attributes: ['a', 'b', 'c']
        }
    });

    await sequelize.sync();

    await Foo.findAll({
        // attributes: {
        //     include: ['a']
        // }
        attributes: ['a']
    });
};
