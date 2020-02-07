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
  
  
  function generateId() {
   return  Math.floor(Math.random() * 1e9).toString(16)
  }

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
  },
  { sequelize, modelName: "user" }
);

!(async () => {
  await sequelize.sync({ force: true });

  const id = shortid.generate();
  const newUser = await User.create({
    id,
    username: "janedoe",
    birthday: new Date(1980, 6, 20)
  });

  console.log(`Created user ${newUser.id} with username ${newUser.username}`);

  // serialize into redis cache
  const cachedUser = JSON.stringify(newUser);

  // get it back from cache later
  const fromCache = JSON.parse(cachedUser);
  // Build a sequelize instance to interact with as if it didn't came from the cache
  const builtUser = User.build(fromCache);

  console.log(
    `Retrieved user from cache: ${builtUser.id} with username ${builtUser.username}`
  );

  await builtUser.validate();

  try {
    await builtUser.update({ username: `foobar${shortid.generate()}` });
  } catch (error) {
    console.log(error.original);
    const users = await User.findAll();

    users.forEach(user =>
      console.log(`Found user ${user.id} with username ${user.username}`)
    );
  }
})();

    
};
