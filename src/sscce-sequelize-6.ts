import { DataTypes, Model, Op } from 'sequelize';
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

  class Foo extends Model {}

  Foo.init({
    name: DataTypes.TEXT,
    schoolInfo: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  console.log(await Foo.bulkCreate([{
            name: 'Emma', schoolInfo: {
                numCode: 'No.1', isRegister: false
            }
        }, {
            name: 'Lily', schoolInfo: {
                numCode: 'No.2', isRegister: true
            }
        }, {
            name: 'Jennifer', schoolInfo: {
                numCode: 'No.3'
            }
        }]));
  expect(await Foo.count()).to.equal(3);
  
  // error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ''null'' at line 1
    let foos = await Foo.findAll({
            where: {
                schoolInfo: {
                    isRegister: {
                        [Op.is]: null
                    }
                }
            }
        });
        expect(foos.length).to.equal(1)
  
   foos = await Foo.findAll({
            where: {
                schoolInfo: {
                    isRegister: {
                        [Op.not]: true
                    }
                }
            }
        });
        // fail  Expected: 2  Received: 1
        expect(foos.length).to.equal(2);

        
}
