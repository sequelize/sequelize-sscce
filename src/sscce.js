'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// Instead of instantiating Sequelize directly as `new Sequelize`,
// this utility function should be used instead - it automatically
// sets up the configuratio necessary for your SSCCE to be executed
// correctly on each type of database on Travis CI / AppVeyor.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over console.log.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
// 
// Recall that SSCCEs should be minimal! Try to make the shortest
// possible code to show your issue. The shorter your code, the
// more likely it is for you to get a fast response.
module.exports = async function() {

    // Create an instance, using the convenience function instead
    // of the usual instantiation with `new Sequelize(...)`
    const sequelize = createSequelizeInstance({ logQueryParameters: true, benchmark: true });

    // You can use await in your SSCCE!
    await sequelize.authenticate();

    // Define some models and whatever you need for your SSCCE.
    const Foo = sequelize.define('Foo', { name: DataTypes.TEXT });
    const Bar = sequelize.define('Bar', { name: DataTypes.TEXT });
    Foo.belongsTo(Bar);
    Bar.hasOne(Foo);

    // Don't forget to sync your models. The `{ force: true }` option is not
    // necessary because the database is always created from scratch when the
    // SSCCE is executed after pushing to GitHub (by Travis CI and AppVeyor).
    await sequelize.sync();

    // Show the problem!!
    // log(await Foo.findAll());

};