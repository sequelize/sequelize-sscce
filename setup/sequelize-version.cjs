// this file is a .cjs file because ESM can't import JSON quite yet
module.exports = require('sequelize/package.json').version.replace(/^v?/, 'v');
