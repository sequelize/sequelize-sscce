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
    const Foo = sequelize.define('Foo', { name: DataTypes.TEXT, barId: DataTypes.INTEGER, bazId: DataTypes.INTEGER });
    const Bar = sequelize.define('Bar', { label: DataTypes.STRING, isDeleted: DataTypes.BOOLEAN });
    const Baz = sequelize.define('Baz', { tag: DataTypes.STRING });
  
    Foo.belongsTo(Bar);
    Foo.belongsTo(Baz);
  
    await sequelize.sync();
    
    let bar = await Bar.create({ label: 'test bar', isDeleted: false });
    let baz = await Baz.create({ tag: 'test baz' });
  
    log(await Foo.create({ name: 'foo', barId: bar.id, bazId: baz.id }));
    expect(await Foo.count()).to.equal(1); // this is ok
    expect(await Foo.findAll({
      include: [{ model: Bar, where: [{ isDeleted: false }]}, { model: Baz }]
    })).to.have.lengthOf(1);
};
