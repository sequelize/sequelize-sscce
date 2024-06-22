import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, NotNull } from '@sequelize/core/decorators-legacy';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare name: string;

    // Nullable array attribute
    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare colors?: Array<string>;
  }

  sequelize.addModels([Foo]);

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  console.log(await Foo.create({ name: 'TS foo', colors: ['red', 'blue'] }));
  await Foo.create({ name: 'Colorless Foo' });
  expect(await Foo.count()).to.equal(1);

  // This works fine and has the expected result, but type-checking fails with
  
  /*
  No overload matches this call.
  Overload 1 of 2, '(this: ModelStatic<Foo>, options: Omit<FindOptions<InferAttributes<Foo, { omit: never; }>>, "raw"> & { raw: true; }): Promise<...>', gave the following error.
    Type '{ colors: null; }' is not assignable to type 'WhereOptions<InferAttributes<Foo, { omit: never; }>>'.
      Types of property 'colors' are incompatible.
        Type 'null' is not assignable to type 'WhereAttributeHashValue<string[] | undefined>'.
  Overload 2 of 2, '(this: ModelStatic<Foo>, options?: FindOptions<InferAttributes<Foo, { omit: never; }>> | undefined): Promise<...>', gave the following error.
    Type '{ colors: null; }' is not assignable to type 'WhereOptions<InferAttributes<Foo, { omit: never; }>>'.
      Types of property 'colors' are incompatible.
        Type 'null' is not assignable to type 'WhereAttributeHashValue<string[] | undefined>'.ts(2769)
  model.d.ts(104, 3): The expected type comes from property 'where' which is declared here on type 'Omit<FindOptions<InferAttributes<Foo, { omit: never; }>>, "raw"> & { raw: true; }'
  */

  // I _think_ the correct type for where.colors would be WhereAttributeHashValue<string[] | null | undefined> because it is a nullable attribute of the model.
  const foosWithoutColors = await Foo.findAll({
    where: {
      colors: null
    }
  })

  // My type-fu is not good enough to write a unit test asserting that the query type-checks...
  // This is expected to pass. The code works fine, it's only a type inference problem.
  expect(foosWithoutColors.length === 1)
}
