'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #10943
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const Picture = sequelize.define("picture", { name: Sequelize.STRING }, { timestamps: false });
    const Tag = sequelize.define("tag", { name: Sequelize.STRING }, { timestamps: false });
    Picture.belongsToMany(Tag, { through: 'fee_picture_tag' });
    Tag.belongsToMany(Picture, { through: 'fee_picture_tag' });

    await sequelize.sync();

    async function prep() {
        await Picture.create({ name: "pic1" });
        await Tag.create({ name: "tag1" });
    
        await Picture.create({ name: "pic2" });
        await Tag.create({ name: "tag2" });
    
        await Picture.create({ name: "pic3" });
        await Tag.create({ name: "tag3" });
    
        await (await Picture.findByPk(1)).addTags([1, 2]);
        await (await Picture.findByPk(2)).addTags([1, 2, 3]);
        await (await Picture.findByPk(3)).addTags([2, 3]);
    }

    await prep();

    console.log('(1) ' + '-'.repeat(50) + '\n');

    log(await Picture.findAll({ include: Tag }));

    console.log('(2) ' + '-'.repeat(50) + '\n');

    log(await Picture.findAll({
        distinct: true,
        include: [{
            model: Tag,
            attributes: ['id', 'name'],
        }],
    }));

    console.log('(3) ' + '-'.repeat(50) + '\n');

    log(await Picture.findAll({
        include: [{
            model: Tag,
            attributes: ['id', 'name'],
            through: {
                where: {
                    tagId: 3,
                },
            },
        }]
    }));

    console.log('(4) ' + '-'.repeat(50) + '\n');

    log(await sequelize.query(`
        SELECT
            "picture"."id",
            "picture"."name",
            "tags"."id" AS "tags.id",
            "tags"."name" AS "tags.name",
            "tags->fee_picture_tag"."createdAt" AS "tags.fee_picture_tag.createdAt",
            "tags->fee_picture_tag"."updatedAt" AS "tags.fee_picture_tag.updatedAt",
            "tags->fee_picture_tag"."pictureId" AS "tags.fee_picture_tag.pictureId",
            "tags->fee_picture_tag"."tagId" AS "tags.fee_picture_tag.tagId"
        FROM "pictures" AS "picture"
        LEFT OUTER JOIN (
            "fee_picture_tag" AS "tags->fee_picture_tag"
                INNER JOIN "tags" AS "tags"
                    ON "tags"."id" = "tags->fee_picture_tag"."tagId"
        )
            ON "picture"."id" = "tags->fee_picture_tag"."pictureId"
            WHERE "picture"."id" = 3
        ;
    `, { type: sequelize.QueryTypes.SELECT, model: Picture }));
};
