'use strict';

/**
 * Your SSCCE goes inside this function.
 * 
 * Please do everything inside it, including requiring dependencies.
 * 
 * Two parameters, described below, are automatically passed to this
 * function for your convenience. You should use them in your SSCCE.
 * 
 * @param {function(options)} createSequelizeInstance This parameter
 * is a function that you should call to create the sequelize instance
 * for you. You should use this instead of `new Sequelize(...)` since
 * it will automatically setup every dialect in order to automatically
 * run it on all dialects once you push it to GitHub (by using Travis
 * CI and AppVeyor). You can pass options to this function, they will
 * be sent to the Sequelize constructor.
 * 
 * @param {function} log This is a convenience function to log results
 * from queries in a clean way, without all the clutter that you would
 * get from simply using `console.log`. You should use it whenever you
 * would use `console.log` unless you have a good reason not to do it.
 */
module.exports = async function(createSequelizeInstance, log) {
  if (process.env.DIALECT !== "postgres") return;
  
  const Sequelize = require('sequelize');
  const sequelize = createSequelizeInstance({ benchmark: true });
  
  sequelize.addHook('afterConnect', (client) => {
  //never fired
  client.on('notice', msg => {
    console.log('notice:', msg)
  })
  //never fired
  client.on('notification', msg => {
    console.log(msg.channel)
    console.log(msg.payload)
  })
});

 await sequelize.query("DO language plpgsql $$ BEGIN RAISE NOTICE 'hello, world!'; END $$;");
};
