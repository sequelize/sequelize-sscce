'use strict';

function check(type, str, sequelize) {
  let name = ('foo' + Math.random()).replace(/\./g, '');
  try {
    console.log('trying ' + str);
    sequelize.define(name, { test: type });
    console.log(str + ' worked');
  } catch (e) {
    console.log(str + " didn't work:", e.message);
  }
}

module.exports = async function(createSequelizeInstance, log) {
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance();
    await sequelize.authenticate();
    check(DataTypes.INTEGER.UNSIGNED, 'DataTypes.INTEGER.UNSIGNED', sequelize);
    check(DataTypes.INTEGER.ZEROFILL, 'DataTypes.INTEGER.ZEROFILL', sequelize);
    check(DataTypes.INTEGER.UNSIGNED.ZEROFILL, 'DataTypes.INTEGER.UNSIGNED.ZEROFILL', sequelize);
    check(DataTypes.INTEGER.ZEROFILL.UNSIGNED, 'DataTypes.INTEGER.ZEROFILL.UNSIGNED', sequelize);
    check(DataTypes.INTEGER(10).UNSIGNED, 'DataTypes.INTEGER(10).UNSIGNED', sequelize);
    check(DataTypes.INTEGER(10).ZEROFILL, 'DataTypes.INTEGER(10).ZEROFILL', sequelize);
    check(DataTypes.INTEGER(10).UNSIGNED.ZEROFILL, 'DataTypes.INTEGER(10).UNSIGNED.ZEROFILL', sequelize);
    check(DataTypes.INTEGER(10).ZEROFILL.UNSIGNED, 'DataTypes.INTEGER(10).ZEROFILL.UNSIGNED', sequelize);
    check(DataTypes.INTEGER().UNSIGNED, 'DataTypes.INTEGER().UNSIGNED', sequelize);
    check(DataTypes.INTEGER().ZEROFILL, 'DataTypes.INTEGER().ZEROFILL', sequelize);
    check(DataTypes.INTEGER().UNSIGNED.ZEROFILL, 'DataTypes.INTEGER().UNSIGNED.ZEROFILL', sequelize);
    check(DataTypes.INTEGER().ZEROFILL.UNSIGNED, 'DataTypes.INTEGER().ZEROFILL.UNSIGNED', sequelize);
    await sequelize.authenticate();
    await sequelize.sync();
    await sequelize.authenticate();
};
