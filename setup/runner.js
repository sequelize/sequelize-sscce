'use strict';

require('./global-adjusts');

const sequelizeVersion = require('./sequelize-version');

const USE_TS = process.env.LOCAL_TS_RUN || process.env.CI_COMBINATION === 'v6 with TS';

async function run() {
  let heading = `Running SSCCE for ${process.env.DIALECT.toUpperCase()} with Sequelize ${sequelizeVersion}`;
  if (USE_TS) heading += ' with TypeScript';
  heading = `===== ${heading} =====`;

  console.blue('\n' + '-'.repeat(heading.length));
  console.blue(heading);
  console.blue('-'.repeat(heading.length) + '\n');

  if (process.env.LOCAL_SSCCE) {
    console.gold('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis CI / AppVeyor in your GitHub repository.\n');
  }

  if (USE_TS) {
    const { run } = require('./../ts-dist/sscce'); // eslint-disable-line
    await run();
  } else {
    await require('./../src/sscce')();
  }
}

(async () => {
  try {
    await run();
    console.log('\n' + '-'.repeat(40) + '\n');
    console.green('SSCCE done without errors!');
  } catch (e) {
    console.red(e);
    console.log('\n' + '-'.repeat(40) + '\n');
    console.red('SSCCE done with error (see above).');
    process.exit(1); // eslint-disable-line no-process-exit
  }
})();
