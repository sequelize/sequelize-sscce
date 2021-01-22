// Require the necessary things from Sequelize
import { Model, DataTypes } from 'sequelize';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
import log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
import { expect } from 'chai';

// Your SSCCE goes inside this function.
export async function run() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

  interface ICompanyAttributes {
    name?: string
  }

  interface IUserAttributes {
    fullName?: string
  }

  class Company extends Model<ICompanyAttributes> implements ICompanyAttributes {
    public name?: string
  }

  class User extends Model<IUserAttributes> implements IUserAttributes {
    public fullName?: string
  }

  await User.findOne({
    where: { fullName: 'abc' },
    include: [Company],
//  ^ compile error 🔥
  })
}
