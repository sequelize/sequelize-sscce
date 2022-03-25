const Sequelize = require("sequelize");

class genre extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.NUMBER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "genre",
        timestamps: true,
        indexes: [
          {
            name: "genre_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
    return genre;
  }
}

module.exports = genre;
