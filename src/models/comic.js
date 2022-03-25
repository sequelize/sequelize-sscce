const Sequelize = require("sequelize");

class comic extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
      },
      {
        sequelize,
        tableName: "comic",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "comic_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
    return comic;
  }
}

module.exports = comic;
