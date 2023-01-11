import {DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from 'sequelize';
import {createSequelize6Instance} from '../setup/create-sequelize-instance';
import assert from "assert";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6
class TestModel extends Model<InferAttributes<TestModel>, InferCreationAttributes<TestModel>> {
  declare readonly id: string;
  declare readonly name: string;
}

function initTestModel(sequelize: Sequelize) {
  TestModel.init(
    {
      id: {type: DataTypes.UUID, primaryKey: true},
      name: {type: DataTypes.UUID, allowNull: false}
    },
    {
      sequelize: sequelize,
      timestamps: false,
      modelName: 'example',
      indexes: [
        {
          type: 'UNIQUE',
          fields: ['id', 'name']
        }
      ]
    }
  );
}

// Your SSCCE goes inside this function.
export async function run() {
  // Delete and then recreate schema so we know they are empty.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
  });
  await sequelize.query('DROP SCHEMA IF EXISTS public, test CASCADE');
  await sequelize.query('CREATE SCHEMA public');
  await sequelize.query('CREATE SCHEMA test');

  // Instance 1, table will be created as excepted.
  const sequelize1 = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    schema: 'test',
    define: {
      schema: 'test'
    }
  });
  initTestModel(sequelize1);
  await sequelize1.sync({force: true});

  // Instance 2, table will be created, but index is not created.
  const sequelize2 = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    schema: undefined, // eg schema "public"
    define: {
      schema: undefined, // eg schema "public"
    }
  });
  initTestModel(sequelize2);
  await sequelize2.sync({force: true})

  // Verify the results.
  const index = await sequelize2.getQueryInterface().showIndex({
    tableName: 'examples',
    schema: 'public',
    delimiter: '.'
  });

  // Current workaround for the issue is in the "sequelize2" instead of "undefined"
  // use the postgres default schema value "public", this will work as excepted.
  // the issue from what I can see is when sequelize try to create the table in the sequelize2
  // the system detect an index with the same name already exists (eg the index belong to the "test" schema)
  // and then do not create the index, even if we're talking about two different table in two different schemas.

  assert.deepStrictEqual(index,
    [
      {
        name: 'examples_id_name',
        primary: false,
        unique: true,
        indkey: '1 2',
        definition: 'CREATE UNIQUE INDEX examples_id_name ON public.examples USING btree (id, name)',
        fields: [
          {attribute: 'id', collate: undefined, length: undefined, order: undefined},
          {attribute: 'name', collate: undefined, length: undefined, order: undefined}
        ]
      },
      {
        name: 'examples_pkey',
        primary: true,
        unique: true,
        indkey: '1',
        definition: 'CREATE UNIQUE INDEX examples_pkey ON public.examples USING btree (id)',
        fields: [
          {attribute: 'id', collate: undefined, length: undefined, order: undefined}
        ]
      }
    ]);


}
