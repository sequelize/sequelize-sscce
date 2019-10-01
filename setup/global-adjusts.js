'use strict';

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
Sequelize.Promise.onPossiblyUnhandledRejection(e => {
  console.error('An unhandled rejection occurred:');
  throw e;
});

Sequelize.Promise.longStackTraces();

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