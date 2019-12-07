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
    if (process.env.DIALECT !== "sqlite") return;

    // Require necessary things from Sequelize
    const Sequelize = require('sequelize');

    class User extends Sequelize.Model {
    }

    class Group extends Sequelize.Model {
    }

    async function doTest() {  
        const sequelize = new Sequelize('database', 'username', 'password', {
            dialect: 'sqlite',
            storage: ':memory:',
        });

        User.init({
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          email: Sequelize.STRING,
        }, { sequelize, modelName: 'users' });

        Group.init({
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING,
        }, { sequelize, modelName: 'groups' });

        User.belongsToMany(Group, { through: 'userInGroups' });
        Group.belongsToMany(User, { through: 'userInGroups' });

        await sequelize.sync();

        const user = await User.create({email: 'user@user.com'});
        const group = await Group.create({name: 'userGroup'});

        await user.addGroup(group);

        // Note that following line prints differently between the two runs, in the first run
        // the association is made, in the second run it's not.
        // Changing to sequelize.define instead of User/Group.init makes both runs make the
        // association.
        log('userGroups', await user.getGroups().map(group => group.name));
    }
  
    await doTest();
    log('---------------------------------------');
    await doTest();
 };
