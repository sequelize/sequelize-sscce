'use strict';

require('./global-adjusts');

async function run() {
    console.log('\n' + '-'.repeat(30) + '\n');

    if (process.env.LOCAL_SSCCE) {
        console.gold('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis CI / AppVeyor in your GitHub repository.\n');
    }

    if (process.env.USE_TS) {
        console.blue(`===== Running SSCCE for ${process.env.DIALECT.toUpperCase()} with TypeScript =====`);
    } else {
        console.blue(`===== Running SSCCE for ${process.env.DIALECT.toUpperCase()} =====`);
    }

    console.log('\n' + '-'.repeat(30) + '\n');

    if (process.env.USE_TS) {
        const { run } = require('./../ts-dist/sscce'); // eslint-disable-line
        await run();
    } else {
        await require('./../src/sscce')();
    }
}

(async () => {
    try {
        await run();
        console.log('\n' + '-'.repeat(30) + '\n');
        console.green('SSCCE done without errors!');
    } catch (e) {
        console.red(e);
        console.log('\n' + '-'.repeat(30) + '\n');
        console.red('SSCCE done with error (see above).');
        process.exit(1); // eslint-disable-line no-process-exit
    }
})();