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
  const { DataTypes } = require("sequelize");
  const sequelize = createSequelizeInstance({
    pool: { max: 2, acquire: 1000 },
  });

  const define = table => {
    return sequelize.define(table, {
      id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
    }, { freezeTableName: true, timestamps: false });
  };
  const doQuery = async (model, txn) => {
    try {
      await model.update({ id: Sequelize.col("id") }, { where: {}, transaction: txn });
    } catch (e) {
      console.log(`Query on ${model.name} failed: ${e.message}`);
    }
  };
  const logPool = msg => {
    const pool = sequelize.connectionManager.pool;
    log(`${msg}: pool size=${pool.size} using=${pool.using} available=${pool.available}`);
  }

  const test1 = define("test1");
  const test2 = define("test2");
  await sequelize.sync({ force: true });
  await test1.create({ id: 1 });
  await test2.create({ id: 1 });
  logPool("Before transactions");

  const t1 = await sequelize.transaction();
  const t2 = await sequelize.transaction();
  await doQuery(test1, t1);
  await doQuery(test2, t2);
  logPool("Before deadlock");

  /* One of these queries will fail. It's almost always the second one, but not 100% of the time */
  await Promise.race([doQuery(test2, t1), doQuery(test1, t2)]);
  logPool("After deadlock");

  /* This will time out */
  try {
    /*const t3 =*/ await sequelize.transaction();
  } catch (e) {
    log(e.stack);
  }
  logPool("At end");
};
