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
module.exports = async function () {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false, // For less clutter in the SSCCE
        },
    });

    const Foo = sequelize.define('Foo', {
        id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        name: { type: DT.STRING, allowNull: false, unique: true }
    });

    await sequelize.sync();
  
    // upsert the initial data, with a unique "name" 
    const [f1] = await Foo.upsert({ name: 'foo' }, { returning: true });
    expect(await Foo.count()).to.equal(1);
  
    // upsert the same data as before, which should result in matching the "name" 
    // and returning the original record & "id"    
    const [f2] = await Foo.upsert({ name: 'foo' }, { returning: true });
    expect(await Foo.count()).to.equal(1);
    expect(f1.id).to.equal(f2.id);
};
