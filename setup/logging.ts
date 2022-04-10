import isPlainObject from 'lodash/isPlainObject.js';
import type { Chalk } from 'chalk';
import chalk from 'chalk';
import type { Options } from 'sequelize';

function isOptionsObject(arg: any): arg is Options {
  return arg && isPlainObject(arg) && Object.prototype.hasOwnProperty.call(arg, 'logging');
}

export function log(...args: any[]): void {
  args = args.filter(x => x !== undefined);
  if (args.length === 0) {
    return;
  }

  if (isOptionsObject(args[args.length - 1])) {
    args.pop();
  }

  args[0] = chalk.gray(args[0]);
  if (args.length === 2) {
    // If benchmarking option is enabled, the logging will have a
    // second argument last argument which is the elapsed time
    args[1] = chalk.blue(`[Elapsed time: ${args[1]} ms]`);
  }

  console.log('[Sequelize]', ...args, '\n');
}

export function logRed(...args: any[]): void {
  return logColor(chalk.red, ...args);
}

export function logBlue(...args: any[]): void {
  return logColor(chalk.blue, ...args);
}

export function logGreen(...args: any[]): void {
  return logColor(chalk.green, ...args);
}

export function logYellow(...args: any[]): void {
  return logColor(chalk.yellow, ...args);
}

function logColor(color: Chalk, ...args: any[]) {
  return console.log(...args.map(arg => {
    if (typeof arg !== 'string') {
      return arg;
    }

    return color(arg);
  }));
}
