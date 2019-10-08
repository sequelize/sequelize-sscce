/**
 * This file is meant to be used only for exhibiting
 * TypeScript-related issues.
 * 
 * In other words, this is for things that fail to compile.
 * 
 * The SSCCE runner will simply try to compile this file. It
 * won't even be executed. So if your problem happens at
 * runtime, you should use `src/sscce.js` instead.
 */

import { Sequelize, Op, Model, DataTypes, QueryTypes } from "sequelize";

async function compileMe() {
    const sequelize = new Sequelize();
    class User extends Model {};
    User.init({
        name: DataTypes.TEXT,
        pass: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'User'
    });
    User.create();
    User.methodThatDoesNotExist();
}