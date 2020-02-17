'use strict';

const jsonStringifySafe = require('json-stringify-safe');

module.exports = function log(...args) {
    console.log.apply(console, args.map(arg => {
        return jsonStringifySafe(arg, null, 2);
    }));
};