import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

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

  class Task extends Model {}

  Task.init({
    // id: DataTypes.INTEGER,
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Task',
  });

  class Country extends Model {}

  Country.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Country',
  });

  class TaskCountry extends Model {}

  TaskCountry.init({
    TaskId: {
      type: DataTypes.INTEGER,
      references: {
        model: Task,
        key: 'id'
      },
      primaryKey: true
    },
    CountryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Country,
        key: 'id'
      },
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'TaskCountry',
  });

  Task.hasMany(TaskCountry);
  TaskCountry.belongsTo(Task);

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  await Task.create({
    id: 1,
    name: "first task"
  });
  await Task.create({
    id: 15,
    name: "second task"
  });

  await Country.create({
    id: 2,
    name: "first country"
  });
  await Country.create({
    id: 52,
    name: "second country"
  });

  await TaskCountry.create({
    TaskId: 1,
    CountryId: 52
  });
  await TaskCountry.create({
    TaskId: 15,
    CountryId: 2
  });

  const tasks = await Task.findAll({
    include: [{ model: TaskCountry, separate: true }]
  })
  expect(tasks[0].getDataValue("TaskCountries")).to.be.an('array').that.has.length(1)
  expect(tasks[1].getDataValue("TaskCountries")).to.be.an('array').that.has.length(1)
}
