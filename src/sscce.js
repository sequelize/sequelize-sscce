"use strict";

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require("./utils/create-sequelize-instance");

// This is a utility logger that should be preferred over `console.log()`.
const log = require("./utils/log");

// Your SSCCE goes inside this function.
module.exports = async function() {
  if (process.env.DIALECT !== "postgres") return;
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });
  // models
  const Exercise = sequelize.define("Exercise", { title: DataTypes.STRING });
  const Exercise_Metrics = sequelize.define("Exercise_Metrics", {
    tags_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: []
    }
  });

  // associations
  Exercise.hasOne(Exercise_Metrics, {
    as: "metrics",
    foreignKey: { name: "exercise_id", allowNull: false }
  });
  Exercise_Metrics.belongsTo(Exercise, {
    as: "exercise",
    foreignKey: { name: "exercise_id", allowNull: false }
  });

  await sequelize.sync();
  const aExercise = await Exercise.create({ title: "Bugzilla-42" });
  await Exercise_Metrics.create({ exercise_id: aExercise.get("id") });
  log(
    await Exercise.findAll({
      order: [
        [
          { model: sequelize.models.Exercise_Metrics, as: "metrics" },
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("array_length", Sequelize.col("tags_ids"), 1),
            0
          ),
          "DESC"
        ]
      ]
    })
  );
  //log();
};
