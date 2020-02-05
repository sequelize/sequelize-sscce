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
    //First instance connected to DatabaseA
    const sequelizeA = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
  
    //ES6 Model classes
    class ModelA extends Model {}
    class ModelB extends Model {}
  
    //Initialize them
    ModelA.init({}, {sequelize: sequelizeA, modelName: "ModelA"});
    ModelB.init({}, {sequelize: sequelizeA, modelName: "ModelB"});
    
    //Make association
    ModelA.belongsToMany(ModelB, {through: "Assoc"});
    ModelB.belongsToMany(ModelA, {through: "Assoc"});
  
    await sequelizeA.sync();
  
    //Instantiate
    const aModelA = new ModelA({});
    const aModelB = new ModelB({});
  
    await aModelA.save();
    await aModelB.save();
  
    //Add assoc between models
    await aModelA.addModelB(aModelB);
  
    await sequelizeA.close();
  
    /*
     * For this example we're finished here. 
     * Now assume that we now want to connect to another database with the same structure.
     */
  
    //First instance connected to DatabaseB
    const sequelizeB = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
  
    //Model classes are already defined
  
    //Initialize them
    ModelA.init({}, {sequelize: sequelizeB, modelName: "ModelA"});
    ModelB.init({}, {sequelize: sequelizeB, modelName: "ModelB"});
    
    //Make association
    ModelA.belongsToMany(ModelB, {through: "Assoc"});
    ModelB.belongsToMany(ModelA, {through: "Assoc"});
  
    await sequelizeB.sync();
  
    //Instantiate
    const bModelA = new ModelA({});
    const bModelB = new ModelB({});
  
    await bModelA.save();
    await bModelB.save();
  
    //Add assoc between models
    await bModelA.addModelB(bModelB);
  
    // Never gets here
    await sequelizeB.close();
};
