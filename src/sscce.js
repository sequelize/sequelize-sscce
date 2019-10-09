'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #10932
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const Foo = sequelize.define("foo", {
        abc: Sequelize.STRING,
        def: Sequelize.STRING,
        // myMethod: Sequelize.VIRTUAL // Uncommenting this fixes it
    }, {
        getterMethods: {
            myMethod() {
                return "aha!" + this.id;
            }
        }
    });

    await sequelize.sync();

    await Foo.create({ abc: "123", def: "456" });

    // This works
    log("direct access to myMethod: " + (await Foo.findOne()).myMethod);

    // This doesn't work - should have "myMethod" key in resulting object
    log(await Foo.findOne());
};
