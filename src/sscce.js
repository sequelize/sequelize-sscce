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
    const root = await Root.create({});
    await root.createRequiredMain({});

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    log('This query will fail! "Separate" subQuery tries to reference subQuery column that does not exist')
    try {
        await Root.findAll({
            include: [{
                model: RequiredMain,
                required: true,
                include: [{
                    model: RootSub,
                    separate: true,
                    include: [{
                        model: BadJoinParent,
                        attributes: [],
                        required: true,
                        include: [{
                            model: BadJoinChild,
                        }],
                    }],
                }],
            }],
        });
    } catch (err) {
        log('SQL FAILED');
        log(err.original);
    }

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // This seems like it is just re-using the previous failing case, but
    // it will fail when RequiredMain's `required` is programmatically omitted in _findSeparate
    // while the previous case will pass, showing that it is not enough of a solution
    log('This query will also fail! "Separate" subQuery tries to reference (different) subQuery column that does not exist')
    try {
        await Root.findAll({
            include: [{
                model: RequiredMain,
                required: true,
                include: [{
                    model: RootSub,
                    attributes: ['requiredMainId'],
                    separate: true,
                    include: [{
                        model: BadJoinParent,
                        attributes: [],
                        required: true,
                        include: [{
                            model: BadJoinChild,
                        }],
                    }],
                }],
            }],
        });
    } catch (err) {
        log('SQL FAILED');
        log(err.original);
    }

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // Just to show that all parts of query work on their own
    log('Following queries are valid and have valid results');

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // success
    log('Parent of Separate is not required');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            // required: true,
            include: [{
                model: RootSub,
                separate: true,
                include: [{
                    model: BadJoinParent,
                    attributes: [],
                    required: true,
                    include: [{
                        model: BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // success
    log('Separate is not used');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            required: true,
            include: [{
                model: RootSub,
                // separate: true,
                include: [{
                    model: BadJoinParent,
                    attributes: [],
                    required: true,
                    include: [{
                        model: BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // success
    log('Bad Join Parent uses default attributes (all, includes foreign key)');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            required: true,
            include: [{
                model: RootSub,
                separate: true,
                include: [{
                    model: BadJoinParent,
                    // attributes: [],
                    required: true,
                    include: [{
                        model: BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // success
    log('Bad Join Parent does not have an included child');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            required: true,
            include: [{
                model: RootSub,
                separate: true,
                include: [{
                    model: BadJoinParent,
                    attributes: [],
                    required: true,
                    // include: [{ model: BadJoinChild }],
                }],
            }],
        }],
    });

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');

    // success
    log('Bad Join Parent is not required');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            required: true,
            include: [{
                model: RootSub,
                separate: true,
                include: [{
                    model: BadJoinParent,
                    attributes: [],
                    // required: true,
                    include: [{
                        model: BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    // success
    log('Root of Separate query defines attributes but BadJoinParent does not');
    await Root.findAll({
        include: [{
            model: RequiredMain,
            required: true,
            include: [{
                model: RootSub,
                attributes: ['requiredMainId'],
                separate: true,
                include: [{
                    model: BadJoinParent,
                    // attributes: [],
                    required: true,
                    include: [{
                        model: BadJoinChild,
                    }],
                }],
            }],
        }],
    });

    log('~~~~~~~~~~~~~~~~~~~~~~~');
    log('~~~~~~~~~~~~~~~~~~~~~~~');
};
