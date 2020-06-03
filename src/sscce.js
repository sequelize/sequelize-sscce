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
        },
        dialect:'postgres',
        database:'',
        username:'',
        password:'',
        host:'localhost'
    });
    
    const productBrandReco = sequelize.define("productBrandRecoModel", {
        rowId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: null,
            comment: "行码",
            primaryKey: true,
            field: "row_id",
            autoIncrement: false
          },
          topClassId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            comment: "一级分类号",
            primaryKey: false,
            field: "top_class_id",
            autoIncrement: false
          },
          companyId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
            comment: "公司号",
            primaryKey: false,
            field: "company_id",
            autoIncrement: false
          }
    }, {tableName: "product_brand_reco"})


    const company = sequelize.define("companyModel",{
        rowId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            comment: "行码",
            primaryKey: false,
            field: "row_id",
            autoIncrement: false
          },
          companyId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
            comment: "公司号",
            primaryKey: true,
            field: "company_id",
            autoIncrement: false
          },
         companyName: {
            type: DataTypes.STRING(60),
            allowNull: true,
            defaultValue: null,
            comment: "公司名称",
            primaryKey: false,
            field: "company_name",
            autoIncrement: false
          }
    },{tableName: "company"})

    productBrandReco.hasMany(company,{foreignKey:"company_id",sourceKey:"companyId",as:"hotBrands"})


    const topclass = await productBrandReco.findAll({
        attributes: ["topClassId"],
        include: [
            {
                model: company,
                attributes: ['companyId', 'companyName'],
                as: "hotBrands"
            }
        ]
    });

    console.log(JSON.stringify(topclass))

    // log(await Foo.create({ name: 'foo' }));
    // expect(await Foo.count()).to.equal(1);
};
