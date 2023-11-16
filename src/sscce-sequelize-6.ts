import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6
interface FooAttributes {
  createdAt: Date;
  active: boolean;
  completedAt: Date;
  time: number;
}

interface FooCreationAttributes {
  createdAt: Date;
  active: boolean;
}
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

  class Foo extends Model<FooAttributes, FooCreationAttributes> {
    createdAt!: Date;
    active!: boolean;
    completedAt: Date|null = null;
    time?: number;
  }

  Foo.init({
    createdAt: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    completedAt: DataTypes.DATE,
    time: {
      type: DataTypes.INTEGER,
      get() {
        return Math.trunc(((this.completedAt ?? new Date()).getTime() - this.createdAt.getTime()) / 1000);
      }
    }
  }, {
    sequelize,
    modelName: 'Foo',
  });

  await sequelize.sync({ force: true });

  await Foo.create({ createdAt: new Date(), active: true });

  await Foo.update({ completedAt: sequelize.literal('createdAt') }, { where: { active: true } });
}
