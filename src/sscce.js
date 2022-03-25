"use strict";

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require("./utils/create-sequelize-instance");

// This is an utility logger that should be preferred over `console.log()`.
const log = require("./utils/log");

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require("sinon");
const { expect } = require("chai");

// import models

const _comic = require("./models/comic");
const _comicGenre = require("./models/comicGenre");
const _genre = require("./models/genre");

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  });

  const comic = _comic.init(sequelize, DataTypes);
  const comicGenre = _comicGenre.init(sequelize, DataTypes);
  const genre = _genre.init(sequelize, DataTypes);

  comic.belongsToMany(genre, {
    as: "genres",
    through: comicGenre,
    foreignKey: "comicId",
    otherKey: "genreId",
  });
  genre.belongsToMany(comic, {
    as: "comics",
    through: comicGenre,
    foreignKey: "genreId",
    otherKey: "comicId",
  });
  comicGenre.belongsTo(comic, { as: "comic_comic", foreignKey: "comicId" });
  comic.hasMany(comicGenre, { as: "comic_genres", foreignKey: "comicId" });
  comicGenre.belongsTo(genre, { as: "genre_genre", foreignKey: "genreId" });
  genre.hasMany(comicGenre, { as: "comic_genres", foreignKey: "genreId" });

  await comic.sync({ force: true }),
  await genre.sync({ force: true }),
  await comicGenre.sync({ force: true }),
};
