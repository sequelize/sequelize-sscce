// Require the necessary things from Sequelize
import { Sequelize, Op, Model, DataTypes, UpsertOptions as SequelizeUpsertOptions, CreateOptions as SequelizeCreateOptions } from 'sequelize';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
import log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
import sinon = require('sinon');
import { expect } from 'chai';

interface CreateOptions extends SequelizeCreateOptions {
  actorId?: number;
}

interface UpsertOptions extends SequelizeUpsertOptions {
  actorId?: number;
}

// Your SSCCE goes inside this function.
export async function run() {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class Foo extends Model { public name: string; public createdBy: number; };
  Foo.init({
    name: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Foo',
    hooks: {
      beforeCreate(model, options: CreateOptions) {
        if (!options.actorId) {
          throw new Error(`Must include actorId option`);
        }
        model.createdBy = options.actorId;
      },
      // @ts-expect-error https://github.com/sequelize/sequelize/pull/13394
      beforeUpsert(attributes: Foo, options: UpsertOptions) {
        if (!options.actorId) {
          throw new Error(`Must include actorId option`);
        }
        attributes.createdBy = options.actorId;
      },
    }
  });

  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  // This passes
  // @ts-expect-error I am using declaration merging to make actorId ok for TS and the value is passed as expected
  log(await Foo.create({ name: 'foo 1' }, { actorId: 1 }));
  expect(await Foo.findOne({ where: { name: 'foo 1' }})).to.include({ createdBy: 1 })

  // This fails but should pass
  // @ts-expect-error I am using declaration merging to make actorId ok for TS and the value is passed as expected
  log(await Foo.upsert({ name: 'foo 2' }, { actorId: 1 }));
  expect(await Foo.findOne({ where: { name: 'foo 2' }})).to.include({ createdBy: 1 })
}
