'use strict';

const createSequelizeInstance = require('./utils/create-sequelize-instance');

module.exports = async function() {
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
