// Require the necessary things from Sequelize
import { Model, DataTypes } from 'sequelize';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
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

    class Foo extends Model {};
    Foo.init({
        name: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Foo'
    });

    await sequelize.sync();

    log(await Foo.create({ name: 'TS foo' }));
}
