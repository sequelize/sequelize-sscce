import { createSequelize6Instance } from '../setup/create-sequelize-instance'
import { Model, Column, DataType, ForeignKey, PrimaryKey, HasMany, Table } from "sequelize-typescript"
import { expect } from 'chai'
import sinon from 'sinon'

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native'])

@Table
class ModelA extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  id!: string

  @HasMany(() => ModelB)
  bValues: ModelB[] | undefined
}

@Table
class ModelB extends Model {
  @PrimaryKey
  @Column({ type: DataType.DATE(6) })
  date!: Date

  @ForeignKey(() => ModelA)
  @Column({ type: DataType.STRING })
  idA!: string
}

export async function run () {
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    }
  })

  await sequelize.addModels([ModelA, ModelB])
  await sequelize.sync({ force: true })
  await ModelA.create({ id: "id1" })
  await ModelB.create({ idA: "id1", date: new Date('2023-03-07T00:00:00.111') })
  await ModelB.create({ idA: "id1", date: new Date('2023-03-07T00:00:00.222') })
  await ModelB.create({ idA: "id1", date: new Date('2023-03-07T00:00:01.333') })

  const directQueryResult = await ModelB.findAll({
    where: { idA: "id1" }
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

  expect(includeQueryResult!.bValues![0].date.getMilliseconds()).to.equal(111) // success
  expect(includeQueryResult!.bValues!.length, 'using include on model B').to.equal(3) // fails
  expect(includeQueryResult!.bValues![1].date.getMilliseconds()).to.equal(222) // fails
  expect(includeQueryResult!.bValues![2].date.getMilliseconds()).to.equal(333) // fails
}
