#!/usr/bin/env node

// @ts-expect-error - it's fine for this to be "any"
import sequelizeVersion from './sequelize-version.cjs';
import './global-adjusts.js';
import assert from 'assert';
import { logBlue, logGreen, logRed, logYellow } from './logging.js';

async function wrappedRun() {
  const dialect = process.env.DIALECT;
  assert(dialect, 'Must provide DIALECT environment variable');

  let heading = `Running SSCCE for ${dialect.toUpperCase()} with Sequelize ${sequelizeVersion}`;

  heading = `===== ${heading} =====`;

  logBlue(`\n${'-'.repeat(heading.length)}`);
  logBlue(heading);
  logBlue(`${'-'.repeat(heading.length)}\n`);

  if (process.env.LOCAL_SSCCE) {
    logYellow('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis CI / AppVeyor in your GitHub repository.\n');
  }

  const { run, testingOnDialects } = await import('../src/sscce.js');
  if (!testingOnDialects.has(process.env.DIALECT!)) {
    logRed(`Skipping dialect ${process.env.DIALECT} as it has been omitted from 'testingOnDialects'`);

    return;
  }

  await run();
}

try {
  await wrappedRun();
  console.log(`\n${'-'.repeat(40)}\n`);
  logGreen('SSCCE done without errors!');
} catch (error) {
  logRed(error);
  console.log(`\n${'-'.repeat(40)}\n`);
  logRed('SSCCE done with error (see above).');

  process.exit(1);
}
