'use strict';

/**
 * Your SSCCE goes inside this function.
 * 
 * Please do everything inside it, including requiring dependencies.
 * 
 * Two parameters, described below, are automatically passed to this
 * function for your convenience. You should use them in your SSCCE.
 * 
 * @param {function(options)} createSequelizeInstance This parameter
 * is a function that you should call to create the sequelize instance
 * for you. You should use this instead of `new Sequelize(...)` since
 * it will automatically setup every dialect in order to automatically
 * run it on all dialects once you push it to GitHub (by using Travis
 * CI and AppVeyor). You can pass options to this function, they will
 * be sent to the Sequelize constructor.
 * 
 * @param {function} log This is a convenience function to log results
 * from queries in a clean way, without all the clutter that you would
 * get from simply using `console.log`. You should use it whenever you
 * would use `console.log` unless you have a good reason not to do it.
 */
module.exports = async function(createSequelizeInstance, log) {
    /**
     * Below is an example of SSCCE. Change it to your SSCCE.
     * Recall that SSCCEs should be minimal! Try to make the shortest
     * possible code to show your issue. The shorter your code, the
     * more likely it is for you to get a fast response.
     */

    // Require necessary things from Sequelize
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    // Create an instance, using the convenience function instead
    // of the usual instantiation with `new Sequelize(...)`
    const sequelize = createSequelizeInstance({ benchmark: true });

    // You can use await in your SSCCE!
    await sequelize.authenticate();

    // Define some models and whatever you need for your SSCCE.
    // Note: recall that SSCCEs should be minimal! Try to make the
    // shortest possible code to show your issue. The shorter your
    // code, the more likely it is for you to get a fast response
    // on your issue.
    const Person = sequelize.define('Person', {
        name: DataTypes.TEXT
    });
  
    person = Person.create({ name: 'Original Name'})
    await Person.update({ updatedAt: new Date('02-26-1991')}, {where: { id: person.id }, silent: true})
    // [ 0 ]

    await person.reload()
    await person.updatedAt
    
    log(person.updatedAt);

    await Person.update({ updatedAt: new Date('02-26-1991'), name: 'A New Name'}, {where: { id: person.id }, silent: true})
    Executing (default): UPDATE "Person" SET "updatedAt"=$1,"name"=$2 WHERE "id" = $3
    // [ 1 ]

    await person.reload()
    person.updatedAt
    
    log(person.updatedAt);
};
