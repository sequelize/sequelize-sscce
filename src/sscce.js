'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
    if (process.env.DIALECT !== "postgres") return;

    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    
    sequelize.addHook('afterConnect', (client) => {
      log('afterConnect executed');
      log('client', client);

      //never fired
      client.on('notice', msg => {
        log('notice:', msg);
      });
      //never fired
      client.on('notification', msg => {
        log(msg.channel);
        log(msg.payload);
      });
    });

    await sequelize.query("DO language plpgsql $$ BEGIN RAISE NOTICE 'hello, world!'; END $$;");
};
