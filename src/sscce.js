'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function () {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

    const User = sequelize.define('User', {
        uid: {
            type: DataTypes.STRING(20),
            unique: true,
            primaryKey: true,
            unique: {
                args: true,
                msg: "Uid already exists"
            },
            field: "uid"
        },
    }, { timestamps: false });
    const Student = sequelize.define('Student', { user_uid: DataTypes.STRING, specialities: DataTypes.ARRAY(DataTypes.STRING(20)) }, { timestamps: false });

    Student.belongsTo(User, { foreignKey: "user_uid", targetKey: "uid" });
    User.hasOne(Student, { foreignKey: "user_uid", sourceKey: "uid" });

    await sequelize.sync();

    log(await Student.destroy({ where: { user_uid: 'usr_1' } }))
    log(await User.destroy({ where: { uid: 'usr_1' } }))

    log(await User.create({ uid: 'usr_1' }));
    log(await Student.create({ user_uid: 'usr_1', specialities: ["spl_1", "spl_2"] }));

    let options = {};
    options["subQuery"] = false;
    options["distinct"] = true;
    options["include"] = [
        {
            model: Student,
            required: true,
            attributes: [["specialities", "user_uid"]]
        }
    ];

    options["where"] = {
        "$Student.specialities$": {
            [Op.contained]: ["spl_1", "spl_2"]
        }
    };

    log(await User.findAndCountAll(options))
};

