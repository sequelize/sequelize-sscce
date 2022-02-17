'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    dialect: "mssql",
    database: environment.database.database,
    host: environment.database.host,
    port: environment.database.port,
    username: environment.database.username,
    password: environment.database.password,
    logging: !environment.production ? console.log : false,
    dialectOptions: {
      options: {
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: "TLSv1",
        },
      },
    },
    define: {
      freezeTableName: true,
      timestamps: false
    }
  });

  class User extends Model {}
  User.init({
    id: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    issendemail: DataTypes.BOOLEAN,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: DataTypes.STRING,
    dateregistration: DataTypes.DATE,
    gender: DataTypes.NUMBER,
    roleId: { type: DataTypes.NUMBER, allowNull: false, field: "web_roles_id" },
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING, allowNull: false },
    remember_token: DataTypes.STRING,
    btaId: { type: DataTypes.NUMBER, field: "bta_users_id" },
    residence_index: DataTypes.STRING,
    sta_street_id_user: DataTypes.NUMBER,
    residence_house: DataTypes.STRING,
    residence_flat: DataTypes.STRING,
    residence_other: DataTypes.STRING,
    del: DataTypes.BOOLEAN,
    tmp: DataTypes.BOOLEAN,
    sta_kont_lico_id: DataTypes.NUMBER,
  }, {
      sequelize: database,
      modelName: "User",
      tableName: "web_users"
  });
  
  class Access extends Model { }
  Access.init({
      id: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true, autoIncrement: true },
      roleId: { type: DataTypes.NUMBER, allowNull: false, field: "web_roles_id" },
      routeId: { type: DataTypes.NUMBER, allowNull: false, field: "web_route_id" },
      isAccess: DataTypes.BOOLEAN,
      userId: { type: DataTypes.NUMBER, allowNull: false, field: "web_users_id" },
  }, {
      sequelize: database,
      modelName: "Access",
      tableName: "web_access"
  });
  
  class Route extends Model { }
  Route.init({
      id: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true, autoIncrement: true },
      route: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      parentRoute: { type: DataTypes.STRING, allowNull: false, field: "parent_route" },
      idRoute: { type: DataTypes.NUMBER, allowNull: false, field: "id_route" }
  }, {
      sequelize: database,
      modelName: "Route",
      tableName: "web_route"
  });

  User.hasMany(Access, { foreignKey: "roleId", sourceKey: "roleId", as: "accesses" });
  Access.belongsTo(User, { foreignKey: "roleId", targetKey: "roleId", as: "user" });
  Access.hasMany(Route, { foreignKey: "id", sourceKey: "routeId", as: "routes" });
  Route.belongsTo(Access, { foreignKey: "id", targetKey: "routeId", as: "accesses" });

  const user = await User.findOne({
    where: { email: payload.email.trim(), '$accesses.isAccess$': 1 },
    include: [{
      model: Access,
      as: 'accesses',
      on: {
        [Op.or]: [
          { '$User.web_roles_id$': Sequelize.col('accesses.web_roles_id') },
          { '$User.id$': Sequelize.col('accesses.web_users_id') }
        ]
      },
      include: [{
        model: Route,
        as: 'routes'
      }]
    }]
  });
};
