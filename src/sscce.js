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
    if (process.env.DIALECT !== "postgres") return;

    const sequelize = createSequelizeInstance({ benchmark: true });

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const transaction = await sequelize.transaction();
    try {
        // notice I did not use `await` here intentionally to show the issue
        sequelize.query('Invalid sql code', { transaction });
        // the line above will execute within our transaction because we allow enough time (1 second in this case)
        await delay(1000);
        // sequelize issues a `COMMIT` statement into PostgreSQL which results in `ROLLBACK` performed
        await transaction.commit();
        // but sequelize does not listen to the postgres result of `COMMIT` call and thus resolves the promise
        // although the `.commit()` sequelize call should resulted in a rejected promise
        log('success, although `COMMIT` postgres statement actually was rolled back');
        log('we should have never seen these lines');
    } catch (error) {
        log('if this message appears, Sequelize works correct');
    }
};
