'use strict';

require('./global-adjusts');

const jetpack = require('fs-jetpack').cwd(__dirname);
const { relative } = require('path');
const replacementsSourcePath = "./../src/lib-replacements";
const replacementsTargetPath = "./../node_modules/sequelize/lib";
const replacementsTargetBackupPath = "./../node_modules/sequelize/sequelize-sscce-lib-backup";

async function ensureLibBackup() {
  if (await jetpack.existsAsync(replacementsTargetBackupPath) === "dir") {
    return;
  }
  await jetpack.copyAsync(replacementsTargetPath, replacementsTargetBackupPath);
}

async function undoReplacements() {
  if (await jetpack.existsAsync(replacementsTargetBackupPath) !== "dir") {
    console.yellow('No replacements to be undone.');
    return;
  }
  console.blue('Undoing replacements...');
  await jetpack.removeAsync(replacementsTargetPath);
  await jetpack.moveAsync(replacementsTargetBackupPath, replacementsTargetPath);
  console.green('Success!');
}

async function doReplacements() {
  const isEmpty = (await jetpack.listAsync(replacementsSourcePath)).length === 0;
  if (isEmpty) {
    console.yellow("No source code replacements to apply.");
    return;
  }
  console.blue(`Doing replacements...`);
  await ensureLibBackup();
  await jetpack.copyAsync(replacementsSourcePath, replacementsTargetPath, {
    overwrite(sourceInspectData/*, destinationInspectData*/) {
      const path = relative(
        jetpack.path(replacementsSourcePath),
        sourceInspectData.absolutePath
      );
      console.blue(` - Overwriting "${path}"`);
      return true;
    }
  });
  console.green('Success!');
}

async function run() {
  if (process.argv[2] === "--do") {
    await doReplacements();
  } else if (process.argv[2] === "--undo") {
    await undoReplacements();
  } else {
    throw new Error('Invalid call to setup/lib-replacements.js');
  }
}

run();
