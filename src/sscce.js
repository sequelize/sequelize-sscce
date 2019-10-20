'use strict';
module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance();
    const Foo = sequelize.define('foo', { data: DataTypes.JSON }, { timestamps: false });
    await sequelize.sync();

    await Foo.create({
        data: {
            a: 1,
            b: [2, 3],
            c: {
                d: 4
            }
        }
    });
    const foo = await Foo.findOne();
    log("foo", foo);
    log("foo.data", foo.data);
    log("typeof foo.data", typeof foo.data);
    log("Object.keys(foo.data)", Object.keys(foo.data));
};
