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
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const identity = (arg) => arg;
    const Foo = sequelize.define('Foo', { name: DataTypes.TEXT, id: DataTypes.INTEGER }, {
      scopes: {
        identityScope: identity,
        altIdentityScope: identity,
      }
    });
    await sequelize.sync();
    log(await Foo.create({ name: 'foo', id: 10 }));
    log(await Foo.create({ name: 'bar', id: 100 }));
    log(await Foo.create({ name: 'bar', id: 2 }));
    log(await Foo.create({ name: 'foo', id: 1 }));
    const scopes = [];
    scopes.push(['identityScope', { where: { [Op.or]: [{ id: 2 }, { id: 1 }] } });
    scopes.push(['altIdentityScope', { where: { name: 'bar' } }]);
    const ScopedFoo = Foo.scope(scopes);
    expect(await ScopedFoo.count()).to.equal(1);
    const results = await ScopedFoo.findAll();
    expect(results[0].id).to.equal(2);
};
