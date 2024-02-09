// this file is a .cjs file because ESM can't import JSON quite yet
module.exports = {
  sequelize6: require('sequelize/package.json').version.replace(/^v?/, 'v'),
  sequelize7: require('@sequelize/core/package.json').version.replace(/^v?/, 'v'),
};
