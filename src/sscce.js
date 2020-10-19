'use strict';
module.exports = (Sequelize, DataTypes) => {
  var Lead = Sequelize.define("Lead", {
    id: {
      allowNull: false, // This particular lines gives the error . 
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID4,
    },

    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
  return Lead;
};
