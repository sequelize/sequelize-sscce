'use strict'

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize')

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance')

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log')

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai')

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false, // For less clutter in the SSCCE
    },
  })
  const NoteFollow = sequelize.define(
    'noteFollows',
    {
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      isFollowing: { type: DataTypes.BOOLEAN, allowNull: false },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noteId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    },
    {
      freezeTableName: true,
      indexes: [{ unique: true, fields: [`noteId`, `userId`] }],
    }
  )
  await sequelize.sync()

  const userId = 'foo'
  const noteId = 'bar'

  const result = await NoteFollow.upsert({
    userId,
    noteId,
    isFollowing: true,
    reason: 'foo',
  })
  const result2 = await NoteFollow.upsert({
    userId,
    noteId,
    isFollowing: true,
    reason: 'foo',
  })

  log(result)
  log(result2)

}
