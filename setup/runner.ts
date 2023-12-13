#!/usr/bin/env node

// @ts-expect-error - it's fine for this to be "any"
import versions from './sequelize-version.cjs';
import './global-adjusts';
import assert from 'assert';
import { existsSync } from 'fs';
import { logBlue, logGreen, logRed } from './logging';

const majorNodeVersion = Number.parseInt(process.version.slice(1), 10);

async function wrappedRun() {
  const dialect = process.env.DIALECT;
  assert(dialect, 'Must provide DIALECT environment variable. Use one of the `test:` npm scripts available. (e.g. `npm run test:sqlite`)');

  let failed = false;

  if (existsSync(`${__dirname}/../src/sscce-sequelize-6.ts`)) {
    let heading = `Running SSCCE for ${dialect.toUpperCase()} with Sequelize ${versions.sequelize6}`;
    heading = `===== ${heading} =====`;

    logBlue(`\n${'-'.repeat(heading.length)}`);
    logBlue(heading);
    logBlue(`${'-'.repeat(heading.length)}\n`);

    const { run, testingOnDialects } = require('../src/sscce-sequelize-6');
    if (!testingOnDialects.has(process.env.DIALECT!)) {
      logRed(`Skipping dialect ${process.env.DIALECT} as it has been omitted from 'testingOnDialects'`);

      return;
    }

    try {
      await run();
    } catch (error) {
      logRed('Sequelize 6 test failed');
      logRed(error);
      failed = true;
    }
  }

  if (existsSync(`${__dirname}/../src/sscce-sequelize-7.ts`)) {
    let heading = `Running SSCCE for ${dialect.toUpperCase()} with Sequelize ${versions.sequelize7}`;
    heading = `===== ${heading} =====`;

    logBlue(`\n${'-'.repeat(heading.length)}`);
    logBlue(heading);
    logBlue(`${'-'.repeat(heading.length)}\n`);

    if (majorNodeVersion >= 18) {
      const { run, testingOnDialects } = require('../src/sscce-sequelize-7');
      if (!testingOnDialects.has(process.env.DIALECT!)) {
        logRed(`Skipping dialect ${process.env.DIALECT} as it has been omitted from 'testingOnDialects'`);

        return;
      }

      try {
        await run();
      } catch (error) {
        logRed('Sequelize 7 test failed');
        logRed(error);
        failed = true;
      }
    } else {
      logRed(`Current node version ${process.version} is insufficient for Sequelize 7, skipping this test`);
    }
  }

  if (failed) {
    console.log(`\n${'-'.repeat(40)}\n`);
    logRed('SSCCE done with error (see above).');
    process.exit(1);
  }

  console.log(`\n${'-'.repeat(40)}\n`);
  logGreen('SSCCE done without errors!');
}

(async () => {
  await wrappedRun();
})();
