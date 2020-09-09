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
    if (process.env.DIALECT !== "sqlite") return;

    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

    class User extends Model {
        public id!: number;
        public ssn!: string;
        public username!: string;
        public birthday!: Date;
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ssn: {
            type: DataTypes.STRING,
            unique: true,
        },
        username: DataTypes.STRING,
        birthday: DataTypes.DATE
    }, { sequelize, modelName: 'user' });

    await sequelize.sync();
    const [jane] = await User.upsert({
        ssn: '123456-XXX',
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    }, { returning: true });

    log('jane', jane);
    expect(jane.id).to.not.be.null;
}
