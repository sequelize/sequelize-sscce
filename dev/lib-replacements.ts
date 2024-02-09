import './global-adjusts.js';
import { relative } from 'path';
import Jetpack from 'fs-jetpack';
import { logBlue, logGreen, logYellow } from './logging.js';

const jetpack = Jetpack.cwd(__dirname);
const replacementsSourcePath = './../src/lib-replacements';
const replacementsTargetPath = './../node_modules/sequelize/lib';
const replacementsTargetBackupPath = './../node_modules/sequelize/sequelize-sscce-lib-backup';

async function ensureLibBackup() {
  if (await jetpack.existsAsync(replacementsTargetBackupPath) === 'dir') {
    return;
  }

  await jetpack.copyAsync(replacementsTargetPath, replacementsTargetBackupPath);
}

async function undoReplacements() {
  if (await jetpack.existsAsync(replacementsTargetBackupPath) !== 'dir') {
    logYellow('No replacements to be undone.');

    return;
  }

  logBlue('Undoing replacements...');
  await jetpack.removeAsync(replacementsTargetPath);
  await jetpack.moveAsync(replacementsTargetBackupPath, replacementsTargetPath);
  logGreen('Success!');
}

async function doReplacements() {
  const result = await jetpack.listAsync(replacementsSourcePath);
  const isEmpty = result == null || result.length === 0;
  if (isEmpty) {
    logYellow('No source code replacements to apply.');

    return;
  }

  logBlue(`Doing replacements...`);
  await ensureLibBackup();
  await jetpack.copyAsync(replacementsSourcePath, replacementsTargetPath, {
    overwrite(sourceInspectData/* , destinationInspectData */) {
      const path = relative(
        jetpack.path(replacementsSourcePath),
        sourceInspectData.absolutePath!,
      );
      logBlue(` - Overwriting "${path}"`);

      return true;
    },
  });
  logGreen('Success!');
}

async function run() {
  if (process.argv[2] === '--do') {
    await doReplacements();
  } else if (process.argv[2] === '--undo') {
    await undoReplacements();
  } else {
    throw new Error('Invalid call to dev/lib-replacements.js');
  }
}

void run();
