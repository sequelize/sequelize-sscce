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

const genreMocks = [
  {
    id: "1",
    name: "Genre 1",
  },
  {
    id: "2",
    name: "Genre 2",
  },
  {
    id: "3",
    name: "Genre 3",
  },
  {
    id: "4",
    name: "Genre 4",
  },
  {
    id: "5",
    name: "Genre 5",
  },
];

const comicMocks = [
  {
    id: "1",
    title: "Comic 1",
    description: "Comic 1",
    comic_genres: [
      {
        genreId: "1",
        isDefault: true,
      },
      {
        genreId: "2",
        isDefault: false,
      },
    ],
  },
  {
    id: "2",
    title: "Comic 2",
    description: "Comic 2",
    comic_genres: [
      {
        genreId: "2",
        isDefault: true,
      },
      {
        genreId: "3",
        isDefault: false,
      },
    ],
  },
];

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

  await comic.sync({ force: true });
  await genre.sync({ force: true });
  await comicGenre.sync({ force: true });

  // create genres
  await Promise.all(genreMocks.map((item) => genre.create(item)));
  // create comics
  await Promise.all(
    comicMocks.map((item) =>
      comic.create(item, {
        include: [{ model: _comicGenre, as: "comic_genres" }],
      })
    )
  );

  const comicBeforeUpdate = await comic.findOne({
    where: { id: "1" },
    include: [
      {
        association: "genres",
        attributes: ["id", "name"],
        through: {
          attributes: ["isDefault"],
        },
      },
    ],
  });

  log("comicBeforeUpdate", comicBeforeUpdate);

  log("START bulkCreate");

  await comicGenre.bulkCreate(
    [
      { genreId: "1", isDefault: false },
      { genreId: "2", isDefault: true },
      { genreId: "3", isDefault: false },
      { genreId: "4", isDefault: false },
      { genreId: "5", isDefault: false },
    ].map((genre) => ({
      comicId: "1",
      ...genre,
    })),
    {
      updateOnDuplicate: ["isDefault"],
    }
  );

  const comicAfterUpdate = await comic.findOne({
    where: { id: "1" },
    include: [
      {
        association: "genres",
        attributes: ["id", "name"],
        through: {
          attributes: ["isDefault"],
        },
      },
    ],
  });

  log("comicAfterUpdate", comicAfterUpdate);

  log("END bulkCreate");
};
