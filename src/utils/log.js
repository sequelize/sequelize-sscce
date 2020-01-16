'use strict';

const jsonStringifySafe = require('json-stringify-safe');

function log(...args) {
    console.log.apply(console, args.map(arg => {
        return jsonStringifySafe(arg, null, 2);
    }));
}

module.exports = log;