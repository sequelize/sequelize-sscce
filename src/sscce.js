'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Foo = sequelize.define('Foo', { 
      name: DataTypes.TEXT,
      test: {
         type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      somethingThatsNull: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
    await sequelize.sync();
    let foo = await Foo.create({ name: 'foo' },{raw:true});
    let foundFoos = await Foo.findAll({where:{id:foo.id},raw:true})
    log(foo);
    log(foundFoos);
  
};
