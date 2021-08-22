'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
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

  const Image = sequelize.define('image', { 
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  
  const Video = sequelize.define('video', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thumbnailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bannerId: DataTypes.INTEGER,
    title: DataTypes.TEXT,
  }, {
    schema: 'video',
    underscored: true,
    paranoid: true,
  });
  
  export const AdImage = sequelize.define('ad_image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    underscored: true,
    paranoid: true,
  });
  
  const VideoAd = sequelize.define('video_ad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adImageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    schema: 'video',
    underscored: true,
    paranoid: true,
  });
  
  Video.belongsTo(Image, { as: 'thumbnail', foreignKey: { name: 'thumbnailId', allowNull: false } });
  Image.hasOne(Video, { as: 'video', foreignKey: { name: 'thumbnailId', allowNull: false } });

  Video.belongsTo(Image, { as: 'bannerImage', foreignKey: { name: 'bannerId', allowNull: true } });
  Image.hasOne(Video, { as: 'bannerVideo', foreignKey: { name: 'bannerId', allowNull: true } });

  VideoAd.belongsTo(Video, { as: 'video', foreignKey: { name: 'videoId', allowNull: false } });
  Video.hasMany(VideoAd, { as: 'ads', foreignKey: { name: 'videoId', allowNull: false } });

  VideoAd.belongsTo(AdImage, { as: 'image', foreignKey: { name: 'adImageId', allowNull: false } });
  AdImage.hasOne(VideoAd, { as: 'ad', foreignKey: { name: 'adImageId', allowNull: false } });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await Image.create({ link: 'image-foo' }));
  log(await Image.create({ link: 'image-bar' }));
  log(await AdImage.create({ url: 'ad-image' }));
  log(await Video.create({ thumbnailId: 1, bannerId: 2, title: 'bar' }));
  log(await VideoAd.create({ videoId: 1, adImageId: 1 }));
  
  const result = await Video.findAndCountAll({
    attributes: ['id', 'title'], // Commenting out attributes allows the query to run but returns count 1, rows []
    limit: 20, // Issue does not happen when limit removed
    include: [{
      model: VideoAd,
      as: 'ads',
      required: false,
      // separate: true, // separate: true is a workaround that allows the query to return the expected results
      include: {
        model: AdImage,
        as: 'image',
        required: false,
      },
    }, {
      model: Image,
      as: 'thumbnail',
      required: true, // Issue does not happen when required: false
    }, {
      model: Image,
      as: 'bannerImage',
      required: false,
    }],
  })
  
  expect(result.count).to.equal(1);
  expect(result.rows.length).to.equal(result.count);
};
