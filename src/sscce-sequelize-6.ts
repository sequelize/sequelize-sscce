import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
// This problem is specific to mysql, but ci  mysql verison to low and use group need config setting so can't run test:mysql
// but sqlite can trigger
export const testingOnDialects = new Set(['sqlite']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Score extends Model { }

  Score.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_name: {
      type: DataTypes.STRING
    },
    score: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE
    },
  }, { sequelize, createdAt: true })

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  await Score.create({ student_name: "tom", score: 0 })
  await Score.create({ student_name: "tom", score: 1 })
  await Score.create({ student_name: "tom", score: 2 })
  //  we sorting  and grouping createdAt with desc
  let data: Array<Score> = await Score.findAll({
    order: [["createdAt", "desc"]],
    group: ["createdAt"],
    attributes: ["student_name", "score"],
  })
  // we expect sorting and grouping get newest date data
  // but sorting and grouping together only one select can't came true ordering before to grouping
  // expect(data[0].getDataValue("student_name")).to.equal("tom")
  expect(data[0].getDataValue("score")).to.equal(2)
}
