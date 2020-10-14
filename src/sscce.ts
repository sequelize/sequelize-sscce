// Require the necessary things from Sequelize
import { Model, DataTypes } from 'sequelize';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
import log = require('./utils/log');

// Your SSCCE goes inside this function.
export async function run() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class User extends Model {
    public firstName: string;
    public id: number;
    public lastName: string;
    public password?: string;
    public username: string;
  }

  User.init({
    firstName: {
      allowNull: false,
      field: `first_name`,
      type: DataTypes.STRING,
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      field: `id`,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    lastName: {
      allowNull: false,
      field: `last_name`,
      type: DataTypes.STRING,
    },
    username: {
      allowNull: false,
      field: `username`,
      type: DataTypes.STRING,
    },
  }, {
    modelName: `user`,
    sequelize,
    tableName: `users`,
    underscored: true,
  });

  await sequelize.sync();

  const user = User.build({
    username: `foo`,
    firstName: `John`,
    lastName: `Doe`
  })

  const users = [ user, user ];

  log(await User.create(user, { isNewRecord: false }));
  log(await User.bulkCreate(users, { isNewRecord: false }));
}
