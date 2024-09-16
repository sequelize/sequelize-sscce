import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';
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

  class Orders extends Model {}
  class OrderLines extends Model {}
  
  Orders.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipToCompany: {
      type: DataTypes.STRING,
      field: 'ship_to_company',
    },
  }, {
    sequelize,
    modelName: 'Orders',
  })

  OrderLines.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderID: {
      type: DataTypes.INTEGER,
      field: 'order',
    },
  }, {
    sequelize,
    modelName: 'OrderLines',
  });
  
  OrderLines.belongsTo(Orders, {
    foreignKey: "orderID",
    as: "order",
  })

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  console.log(await OrderLines.findAll({
    include: [ { association: 'order' } ],
    order: [ [ 'order', 'ship_to_company', 'ASC' ] ] // here 'order' refers to the association, not the field
  }));
  // expect(await Foo.count()).to.equal(1);
}
