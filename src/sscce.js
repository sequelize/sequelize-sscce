'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes, Transaction } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

const delay = ms => new Promise(r => setTimeout(r, ms));
const pSettle = require('p-settle');

const { isDeepStrictEqual } = require('util');

function isDeepEqualToOneOf(actual, expectedOptions) {
  return expectedOptions.some(expected => isDeepStrictEqual(actual, expected));
}

// Your SSCCE goes inside this function.
module.exports = async function() {
  if (process.env.DIALECT !== "mysql" && process.env.DIALECT !== "mariadb") return;

  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  async function verifySelectLockInShareMode() {
    const User = sequelize.define('user', {
      username: DataTypes.STRING,
      awesome: DataTypes.BOOLEAN
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    const { id } = await User.create({ username: 'jan' });

    // First, we start a transaction T1 and perform a SELECT with it using the `LOCK.SHARE` mode (setting a shared mode lock on the row).
    // This will cause other sessions to be able to read the row but not modify it.
    // So, if another transaction tries to update those same rows, it will wait until T1 commits (or rolls back).
    // https://dev.mysql.com/doc/refman/5.7/en/innodb-locking-reads.html
    const t1 = await sequelize.transaction();
    const t1Jan = await User.findByPk(id, { lock: t1.LOCK.SHARE, transaction: t1 });

    // Then we start another transaction T2 and see that it can indeed read the same row.
    const t2 = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED });
    const t2Jan = await User.findByPk(id, { transaction: t2 });

    // Then, we want to see that an attempt to update that row from T2 will be queued until T1 commits.
    const executionOrder = [];
    const [t2AttemptData, t1AttemptData] = await pSettle([
      (async () => {
        try {
          executionOrder.push('Begin attempt to update via T2');
          await t2Jan.update({ awesome: false }, { transaction: t2 });
          executionOrder.push('Done updating via T2');
        } catch (error) {
          executionOrder.push('Failed to update via T2'); // Shouldn't happen
          throw error;
        }

        await delay(30);

        try {
          executionOrder.push('Attempting to commit T2');
          await t2.commit();
          executionOrder.push('Done committing T2');
        } catch {
          executionOrder.push('Failed to commit T2'); // Shouldn't happen
        }
      })(),
      (async () => {
        await delay(100);

        try {
          executionOrder.push('Begin attempt to read via T1');
          await User.findAll({ transaction: t1 });
          executionOrder.push('Done reading via T1');
        } catch (error) {
          executionOrder.push('Failed to read via T1'); // Shouldn't happen
          throw error;
        }

        await delay(150);

        try {
          executionOrder.push('Attempting to commit T1');
          await t1.commit();
          executionOrder.push('Done committing T1');
        } catch {
          executionOrder.push('Failed to commit T1'); // Shouldn't happen
        }
      })()
    ]);

    expect(t1AttemptData.isFulfilled).to.be.true;
    expect(t2AttemptData.isFulfilled).to.be.true;
    expect(t1.finished).to.equal('commit');
    expect(t2.finished).to.equal('commit');

    const expectedExecutionOrder = [
      'Begin attempt to update via T2',
      'Begin attempt to read via T1', // 100ms after
      'Done reading via T1', // right after
      'Attempting to commit T1', // 150ms after
      'Done committing T1', // right after
      'Done updating via T2', // right after
      'Attempting to commit T2', // 30ms after
      'Done committing T2' // right after
    ];

    // The order things happen in the database must be the one shown above. However, sometimes it can happen that
    // the calls in the JavaScript event loop that are communicating with the database do not match exactly this order.
    // In particular, it is possible that the JS event loop logs `'Done updating via T2'` before logging `'Done committing T1'`,
    // even though the database committed T1 first (and then rushed to complete the pending update query from T2).

    const anotherAcceptableExecutionOrderFromJSPerspective = [
      'Begin attempt to update via T2',
      'Begin attempt to read via T1', // 100ms after
      'Done reading via T1', // right after
      'Attempting to commit T1', // 150ms after
      'Done updating via T2', // right after
      'Done committing T1', // right after
      'Attempting to commit T2', // 30ms after
      'Done committing T2' // right after
    ];

    const executionOrderOk = isDeepEqualToOneOf(
      executionOrder,
      [
        expectedExecutionOrder,
        anotherAcceptableExecutionOrderFromJSPerspective
      ]
    );

    if (!executionOrderOk) {
      throw new Error(`Unexpected execution order: ${executionOrder.join(' > ')}`);
    }
  }

  async function verifyDeadlock() {
    const User = sequelize.define('user', {
      username: DataTypes.STRING,
      awesome: DataTypes.BOOLEAN
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    const { id } = await User.create({ username: 'jan' });

    // First, we start a transaction T1 and perform a SELECT with it using the `LOCK.SHARE` mode (setting a shared mode lock on the row).
    // This will cause other sessions to be able to read the row but not modify it.
    // So, if another transaction tries to update those same rows, it will wait until T1 commits (or rolls back).
    // https://dev.mysql.com/doc/refman/5.7/en/innodb-locking-reads.html
    const t1 = await sequelize.transaction();
    const t1Jan = await User.findByPk(id, { lock: t1.LOCK.SHARE, transaction: t1 });

    // Then we start another transaction T2 and see that it can indeed read the same row.
    const t2 = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED });
    const t2Jan = await User.findByPk(id, { transaction: t2 });

    // Then, we want to see that an attempt to update that row from T2 will be queued until T1 commits.
    // However, before commiting T1 we will also perform an update via T1 on the same rows.
    // This should cause T2 to notice that it can't function anymore, so it detects a deadlock and automatically rolls itself back (and throws an error).
    // Meanwhile, T1 should still be ok.
    const executionOrder = [];
    const [t2AttemptData, t1AttemptData] = await pSettle([
      (async () => {
        try {
          executionOrder.push('Begin attempt to update via T2');
          await t2Jan.update({ awesome: false }, { transaction: t2 });
          executionOrder.push('Done updating via T2'); // Shouldn't happen
        } catch (error) {
          executionOrder.push('Failed to update via T2');
          throw error;
        }

        await delay(30);

        try {
          // We shouldn't reach this point, but if we do, let's at least commit the transaction
          // to avoid forever occupying one connection of the pool with a pending transaction.
          executionOrder.push('Attempting to commit T2');
          await t2.commit();
          executionOrder.push('Done committing T2');
        } catch {
          executionOrder.push('Failed to commit T2');
        }
      })(),
      (async () => {
        await delay(100);

        try {
          executionOrder.push('Begin attempt to update via T1');
          await t1Jan.update({ awesome: true }, { transaction: t1 });
          executionOrder.push('Done updating via T1');
        } catch (error) {
          executionOrder.push('Failed to update via T1'); // Shouldn't happen
          throw error;
        }

        await delay(150);

        try {
          executionOrder.push('Attempting to commit T1');
          await t1.commit();
          executionOrder.push('Done committing T1');
        } catch {
          executionOrder.push('Failed to commit T1'); // Shouldn't happen
        }
      })()
    ]);

    expect(t1AttemptData.isFulfilled).to.be.true;
    expect(t2AttemptData.isRejected).to.be.true;
    expect(t2AttemptData.reason.message).to.equal('Deadlock found when trying to get lock; try restarting transaction');
    expect(t1.finished).to.equal('commit');
    expect(t2.finished).to.equal('rollback');

    const expectedExecutionOrder = [
      'Begin attempt to update via T2',
      'Begin attempt to update via T1', // 100ms after
      'Done updating via T1', // right after
      'Failed to update via T2', // right after
      'Attempting to commit T1', // 150ms after
      'Done committing T1' // right after
    ];

    // The order things happen in the database must be the one shown above. However, sometimes it can happen that
    // the calls in the JavaScript event loop that are communicating with the database do not match exactly this order.
    // In particular, it is possible that the JS event loop logs `'Failed to update via T2'` before logging `'Done updating via T1'`,
    // even though the database updated T1 first (and then rushed to declare a deadlock for T2).

    const anotherAcceptableExecutionOrderFromJSPerspective = [
      'Begin attempt to update via T2',
      'Begin attempt to update via T1', // 100ms after
      'Failed to update via T2', // right after
      'Done updating via T1', // right after
      'Attempting to commit T1', // 150ms after
      'Done committing T1' // right after
    ];

    const executionOrderOk = isDeepEqualToOneOf(
      executionOrder,
      [
        expectedExecutionOrder,
        anotherAcceptableExecutionOrderFromJSPerspective
      ]
    );

    if (!executionOrderOk) {
      throw new Error(`Unexpected execution order: ${executionOrder.join(' > ')}`);
    }
  }

  async function runManyTimes(f, count) {
    for (let i = 0; i < count; i++) {
      console.log(`### Starting execution ${i+1} of \`${f.name}\``);

      let time = Date.now();
      let error;

      try {
        await f();
      } catch (error_) {
        error = error_;
      }

      time = Date.now() - time;

      if (error) {
        console.log(`### Execution ${i+1} of \`${f.name}\` finished after ${time} ms with ${error.name}: ${error.message}`);
      } else {
        console.log(`### Execution ${i+1} of \`${f.name}\` finished after ${time} ms successfully`);
      }

      if (error) {
        throw error;
      }

      await delay(10);
    }
  }

  await runManyTimes(verifySelectLockInShareMode, 100);
  await runManyTimes(verifyDeadlock, 100);
};
