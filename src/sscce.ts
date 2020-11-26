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

    class Bar extends Model {};
    Bar.init({
        bar: DataTypes.TEXT,
        name: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Foo'
    });

    class Foo extends Model {
      addBar: any;
    };
    Foo.init({
        name: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Foo'
    });
  
    Foo.associations.Bar = Foo.hasMany(Bar, { scope: { bar: 'foo' } })
  
    await sequelize.sync();
    const bar = await Bar.create({ name: 'bar' });
    const foo = await Foo.create({ name: 'foo' });

    log(bar);
    log(foo);
    log(await foo.addBar(bar))

    expect(await Foo.count()).to.equal(1);
}
