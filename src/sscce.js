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
    const { DataTypes, Model } = require('sequelize');
  
    const sequelize = createSequelizeInstance({});

    class MyTable extends Model {
    }

    MyTable.init({
        parentId: {
            type: DataTypes.INTEGER,
            onDelete: 'RESTRICT',
            references: {
                model: MyTable,
                key: 'id'
            }
        }
    }, { sequelize, modelName: 'Alarms'});

    log("Setting up...");
    // Here the force: true isn't important, it just show that it works the first time
    await sequelize.sync({force: true});
  
    const rootModel = await MyTable.build().save();
    await MyTable.build({parentId: rootModel.id}).save();

    log("Triggering the exception... (for sqlite, maybe other dialect as well)");
    await sequelize.sync({force: true});
};