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

  log(await Foo.create({ name: 'foo' }));
  expect(await Foo.count()).to.equal(1);
};
