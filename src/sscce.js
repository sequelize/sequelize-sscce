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
    class User extends Sequelize.Model {
      static init(sequelize, DataTypes) {
        return super.init(
          {
            uuid: {
              type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            phoneNumber: {
              type: DataTypes.STRING,
              unique: true,
            },
            email: {
              type: DataTypes.STRING,
              unique: true,
            },
            password: DataTypes.STRING,
            isTestData: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
            },
          },
          {
            sequelize,
            timestamps: true,
            modelName: 'User',
          },
        );
      }
    }

    class Location extends Sequelize.Model {
      static init(sequelize, DataTypes) {
        return super.init(
          {
            uuid: {
              type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4,
            },
            alias: DataTypes.STRING,
            name1: DataTypes.STRING,
            name2: DataTypes.STRING,
            address1: DataTypes.STRING,
            address2: DataTypes.STRING,
            address3: DataTypes.STRING,
            address4: DataTypes.STRING,
            city: DataTypes.STRING,
            region: DataTypes.STRING,
            postalCode: DataTypes.STRING,
          },
          {
            sequelize,
            modelName: 'Location',
            timestamps: true,
          },

        );
      }

      static associate() {
        Location.hasOne(
          User,
        );
      }
    }

    User.init(sequelize, Sequelize);
    Location.init(sequelize, Sequelize);

    Location.associate();

    await sequelize.sync();
};
