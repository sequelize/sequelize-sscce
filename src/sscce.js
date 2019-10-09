'use strict';

module.exports = async function(createSequelizeInstance, log) {
    // SSCCE for #10930
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');
    const sequelize = createSequelizeInstance({ benchmark: true });
    await sequelize.authenticate();

    const User = sequelize.define("user", { name: Sequelize.STRING });
    const Image = sequelize.define("image", {
        path: Sequelize.STRING,
        url: {
            type: Sequelize.VIRTUAL(Sequelize.STRING, ['path']),
            get() {
                if (this.getDataValue('path')) {
                    return `abcdef/${this.getDataValue('path')}`;
                } else {
                    return null;
                }
            },
        }
    });

    Image.belongsTo(User);
    User.hasOne(Image);

    await sequelize.sync();

    await User.create({ name: "someone" });

    await Image.create({ path: "me.png", userId: 1 });

    const image = await Image.findByPk(1, { attributes: ['id', 'url'] })

    log(image);

    log(await User.findByPk(1, {
        include: {
            model: Image,
            attributes: ['id', 'url']
            // attributes: ['id', 'url', 'path']
        }
    }));
};
