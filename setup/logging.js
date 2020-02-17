'use strict';

const isPlainObject = require('is-plain-object');
const chalk = require('chalk');

function isOptionsObject(arg) {
    return arg && isPlainObject(arg) && Object.prototype.hasOwnProperty.call(arg, 'logging');
}

module.exports = function(...args) {
    args = args.filter(x => x !== undefined);
    if (args.length === 0) return;
    if (isOptionsObject(args[args.length - 1])) args.pop();
    args[0] = chalk.gray(args[0]);
    if (args.length === 2) {
        // If benchmarking option is enabled, the logging will have a
        // second argument last argument which is the elapsed time
        args[1] = chalk.blue(`[Elapsed time: ${args[1]} ms]`);
    }
    console.log('[Sequelize]', ...args, '\n');
};