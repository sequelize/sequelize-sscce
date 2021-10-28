'use strict';

// Enable same settings to chai from Sequelize main repo
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.config.includeStack = true;
chai.should();

const Sequelize = require('sequelize');
const chalk = require('chalk');

process.on('uncaughtException', e => {
  console.error('An unhandled exception occurred:');
  throw e;
});
process.on("unhandledRejection", e => {
  console.error('An unhandled rejection occurred:');
  throw e;
});

const sequelizeVersion = require('./sequelize-version');

if (sequelizeVersion.startsWith('v5')) {
  Sequelize.Promise.onPossiblyUnhandledRejection(e => {
    console.error('An unhandled rejection occurred:');
    throw e;
  });
  Sequelize.Promise.longStackTraces();
}

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
  'gray',
  'darkRed',
  'darkYellow',
  'purple',
  'pink',
  'orange',
  'cyan',
  'gold'
];

for (const color of colors) {
  console[color] = (...args) => console.log.apply(console, args.map(arg => {
    if (typeof arg !== "string") return arg;
    return chalk.keyword(color)(arg);
  }));
}
