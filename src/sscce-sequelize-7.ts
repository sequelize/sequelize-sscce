// @ts-nocheck
import { DataTypes, Model } from '@sequelize/core'
import { createSequelize7Instance } from '../setup/create-sequelize-instance'
import { expect } from 'chai'
import sinon from 'sinon'

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native'])

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run () {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  })

  const ModelA = sequelize.define('ModelA', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  })

  const ModelB = sequelize.define('ModelB', {
    date: {
      type: DataTypes.DATE(6),
      primaryKey: true
    },
    ModelAId: {
      type: DataTypes.STRING,
      references: {
        model: ModelA,
        key: 'id',
      }
    }
  })

  ModelA.hasMany(ModelB)

  await sequelize.sync({ force: true })

  await ModelA.create({ id: "id1" })
  await ModelB.create({ ModelAId: "id1", date: new Date('2023-03-07T00:00:00.111') })
  await ModelB.create({ ModelAId: "id1", date: new Date('2023-03-07T00:00:00.222') })
  await ModelB.create({ ModelAId: "id1", date: new Date('2023-03-07T00:00:01.333') })

  const directQueryResult = await ModelB.findAll({
    where: { ModelAId: "id1" }
  })

  expect(directQueryResult!.length, 'querying from model A').to.equal(3) // success
  expect(directQueryResult[0].date.getMilliseconds()).to.equal(111) // success
  expect(directQueryResult[1].date.getMilliseconds()).to.equal(222) // success
  expect(directQueryResult[2].date.getMilliseconds()).to.equal(333) // success

  const includeQueryResult = await ModelA.findOne({
    where: { id: "id1" },
    include: {
      model: ModelB
    }
  })

  expect(includeQueryResult!.ModelBs[0].date.getMilliseconds()).to.equal(111) // success
  expect(includeQueryResult!.ModelBs!.length, 'using include on model B').to.equal(3) // fails
  expect(includeQueryResult!.ModelBs[1].date.getMilliseconds()).to.equal(222) // fails
  expect(includeQueryResult!.ModelBs[2].date.getMilliseconds()).to.equal(333) // fails
}
