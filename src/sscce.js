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

    // Instantiate classes
    class Root extends Sequelize.Model {};
    Root.init({}, { sequelize, underscored: true });

    class RequiredMain extends Sequelize.Model {};
    RequiredMain.init({}, { sequelize, underscored: true });

    class RootSub extends Sequelize.Model {};
    RootSub.init({}, { sequelize, underscored: true });

    class BadJoinParent extends Sequelize.Model {};
    BadJoinParent.init({}, { sequelize, underscored: true });

    class BadJoinChild extends Sequelize.Model {};
    BadJoinChild.init({}, { sequelize, underscored: true });

    // Create foreign keys
    Root.belongsTo(RequiredMain);
    RequiredMain.hasMany(RootSub);
    RootSub.belongsTo(BadJoinParent);
    BadJoinParent.belongsTo(BadJoinChild);

    // Apply model to database
    await sequelize.sync();

    // Create models (so "separate" sub query will be triggered)
    const main = await RequiredMain.create({});
    await main.createRoot({});

    log('This query will fail! "Separate" subQuery tries to reference subQuery column that does not exist')
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            required: true,
            include: [{
                model: Model.RootSub,
                separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    attributes: [],
                    required: true,
                    include: [{
                        model: Model.BadJoinChild,
                    }],
                }],
            }],
        }],
    }).catch(log);

    // Just to show that all parts of query work on their own
    log('Following queries are valid and have valid results');

    // success
    log('Parent of Separate is not required');
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            // required: true,
            include: [{
                model: Model.RootSub,
                separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    attributes: [],
                    required: true,
                    include: [{
                        model: Model.BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    // success
    log('Separate is not used');
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            required: true,
            include: [{
                model: Model.RootSub,
                // separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    attributes: [],
                    required: true,
                    include: [{
                        model: Model.BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    // success
    log('Bad Join Parent uses default attributes (all, includes foreign key)');
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            required: true,
            include: [{
                model: Model.RootSub,
                separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    // attributes: [],
                    required: true,
                    include: [{
                        model: Model.BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    // success
    log('Bad Join Parent does not have an included child');
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            required: true,
            include: [{
                model: Model.RootSub,
                separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    attributes: [],
                    required: true,
                    // include: [{ model: Model.BadJoinChild }],
                }],
            }],
        }],
    });

    // success
    log('Bad Join Parent is not required');
    await Root.findAll({
        logging: log,
        include: [{
            model: Model.RequiredMain,
            required: true,
            include: [{
                model: Model.RootSub,
                separate: true,
                include: [{
                    model: Model.BadJoinParent,
                    attributes: [],
                    // required: true,
                    include: [{
                        model: Model.BadJoinChild,
                    }],
                }],
            }],
        }],
    });
};
