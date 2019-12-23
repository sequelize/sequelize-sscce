'use strict';

require('./global-adjusts');

const jsonStringifySafe = require('json-stringify-safe');

function log(...args) {
    console.log.apply(console, args.map(arg => {
        return jsonStringifySafe(arg, null, 2);
    }));
}

async function run() {
    const createSequelizeInstance = require('./create-sequelize-instance');

    console.log('\n\n' + '-'.repeat(30) + '\n\n');

    if (process.env.LOCAL_SSCCE) {
        console.gold('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis and Appveyor in your GitHub repository.\n\n');
    }

    console.blue(`===== Running SSCCE for ${process.env.DIALECT.toUpperCase()} =====`);

    console.log('\n\n' + '-'.repeat(30) + '\n\n');

    await require('./../src/sscce')(createSequelizeInstance, log);
}

(async () => {
    try {
        await run();
        console.log('\n\n' + '-'.repeat(30) + '\n\n');
        console.green('SSCCE done without errors!');
    } catch (e) {
        console.red(e);
        console.log('\n\n' + '-'.repeat(30) + '\n\n');
        console.red('SSCCE done with error (see above).');
        process.exit(1); // eslint-disable-line no-process-exit
    }
})();