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
    const User = sequelize.define('tbl_user', {
      name: Sequelize.STRING
    });
    const Project = sequelize.define('tbl_pproject', {
      name: Sequelize.STRING
    });
    const UserProject = sequelize.define('tbl_user_project', {
      role: Sequelize.STRING
    });
    User.belongsToMany(Project, { as: 'projects', through: UserProject });
    Project.belongsToMany(User, { as: 'users', through: UserProject });
    // through is required!
    
    // Since you defined some models above, don't forget to sync them.
    // Using the `{ force: true }` option is not necessary because the
    // database is always created from scratch when the SSCCE is
    // executed after pushing to GitHub (by Travis CI and AppVeyor).
    await sequelize.sync();

    // create 9 users and 9 projects
    for (let i = 1; i < 10; ++i) {
        await Project.create({ name: 'Project ' + i });
        await User.create({ name: 'Bob ' + i });
    }

    // get 2 projects
    const projects = await Project.findAll({ limit: 2 });
    // ... and 1 user
    const user = await User.findOne({});
    
    // ... assign both projects with a role to that user
    await user.setProjects(projects, { through: { role: 'manager' }})

    // Call your stuff to show the problem...
    const { count, rows } = await User.findAndCountAll({
      include: {
         model: Project, as: 'projects'
      }
    });
  
    log(count + ' should be ' + rows.length + '.... err... wait, what??');
};
