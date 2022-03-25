const Sequelize = require("sequelize");

class comicGenre extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        comicId: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "comic",
            key: "id",
          },
        },
        genreId: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "genre",
            key: "id",
          },
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "comic_genre",
        timestamps: false,
        indexes: [
          {
            name: "comic_genre_pkey",
            unique: true,
            fields: [{ name: "comicId" }, { name: "genreId" }],
          },
        ],
      }
    );
    return comicGenre;
  }
}

module.exports = comicGenre;
