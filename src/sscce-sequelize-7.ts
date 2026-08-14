import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';
import { createSequelize7Instance } from '../dev/create-sequelize-instance';
import { expect } from 'chai';

export const testingOnDialects = new Set(['mssql']);

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

  @Table({ tableName: 'trigger_bulk_create_test', hasTrigger: true })
  class Foo extends Model<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare name: string;
  }

  sequelize.addModels([Foo]);
  await sequelize.sync({ force: true });
  await sequelize.query(`
    CREATE TRIGGER [trigger_bulk_create_test_after_insert]
    ON [trigger_bulk_create_test]
    AFTER INSERT
    AS
    BEGIN
      SET NOCOUNT ON;
    END
  `);

  const [foo] = await Foo.bulkCreate([{ name: 'trigger test' }]);
  expect(foo.id).to.equal(1);
}
