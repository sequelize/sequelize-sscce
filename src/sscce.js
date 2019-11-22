'use strict';

/**
 * Your SSCCE goes inside this function.
 * 
 * Please do everything inside it, including requiring dependencies.
 * 
 * Two parameters, described below, are automatically passed to this
 * function for your convenience. You should use them in your SSCCE.
 * 
 * @param {function(options)} createSequelizeInstance This parameter
 * is a function that you should call to create the sequelize instance
 * for you. You should use this instead of `new Sequelize(...)` since
 * it will automatically setup every dialect in order to automatically
 * run it on all dialects once you push it to GitHub (by using Travis
 * CI and AppVeyor). You can pass options to this function, they will
 * be sent to the Sequelize constructor.
 * 
 * @param {function} log This is a convenience function to log results
 * from queries in a clean way, without all the clutter that you would
 * get from simply using `console.log`. You should use it whenever you
 * would use `console.log` unless you have a good reason not to do it.
 */
module.exports = async function(createSequelizeInstance, log) {
    /**
     * Below is an example of SSCCE. Change it to your SSCCE.
     * Recall that SSCCEs should be minimal! Try to make the shortest
     * possible code to show your issue. The shorter your code, the
     * more likely it is for you to get a fast response.
     */

    // Require necessary things from Sequelize
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    // Create an instance, using the convenience function instead
    // of the usual instantiation with `new Sequelize(...)`
    const sequelize = createSequelizeInstance({ benchmark: true });

    // You can use await in your SSCCE!
    await sequelize.authenticate();

    
    class Product extends Sequelize.Model {}
    Product.init({
      name: {
         type: Sequelize.STRING(45),
         validate: {
            len: [1, 45]
         }
      },
      sku: { 
         type: Sequelize.STRING(16),
         //unique: true,
         validate: {
            len: [3, 16]
         }
      },
      categoryId: {
         type: Sequelize.INTEGER,
      },
      productTypeId: {
         type: Sequelize.INTEGER,
      },
   }, {
      tableName: 'inv_products',
      sequelize
   });
   
   class ProductCategory extends Sequelize.Model {}
   ProductCategory.init({
      name: {
         type: Sequelize.STRING(32),
         validate: {
            len: [3, 32]
         }
      }
   }, {
      freezeTableName: true,
      tableName: 'inv_products_categories',
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      indexes: [
         {
           unique: true,
           fields: ['name']
         }
      ],

      sequelize
   }); 

   class ProductType extends Sequelize.Model {}
   ProductType.init({
      name: {
         type: Sequelize.STRING(32),
         validate: {
            len: [3, 32]
         }
      }
   }, {
      tableName: 'inv_products_types',
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      indexes: [
         {
           unique: true,
           fields: ['name']
         }
      ],

      sequelize
   });

   class ProductLocation extends Sequelize.Model {}
   ProductLocation.init({
      name: {
         type: Sequelize.STRING(32),
         validate: {
            len: [3, 32]
         }
      }
   }, {
      tableName: 'inv_products_locations',
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      indexes: [
         {
           unique: true,
           fields: ['name']
         }
      ],

      sequelize
   });

   class ProductStock extends Sequelize.Model {}
   ProductStock.init({
      productId: {
         type: Sequelize.INTEGER,
         primaryKey: true,
      },
      locationId: {
         type: Sequelize.INTEGER,
         primaryKey: true,
      },
      qty: {
         type: Sequelize.FLOAT,
         defaultValue: 0
      },
   }, {
      tableName: 'inv_products_stock',

      createdAt: false,
      //updatedAt: true,
      deletedAt: false,

      sequelize
   });

   await sequelize.sync();



   // Product
   Product.Category = Product.hasOne(ProductCategory, { foreignKey: 'id', sourceKey: 'categoryId' });
   Product.Type = Product.hasOne(ProductType, { foreignKey: 'id', sourceKey: 'productTypeId' });
   Product.Locations = Product.belongsToMany(ProductLocation, { through: ProductStock, foreignKey: 'productId', otherKey: 'locationId' });
   Product.ALL = [ Product.Category, Product.Type, Product.Locations ];

   // ProductLocation
   ProductLocation.Product = ProductLocation.belongsToMany(Product, { through: ProductStock, foreignKey: 'locationId', otherKey: 'productId' });
   ProductLocation.ALL = [ ProductLocation.Product ];

   // ProductStock
   ProductStock.hasOne(Product, { foreignKey: 'id', sourceKey: 'productId' });
   ProductStock.hasOne(ProductLocation, { foreignKey: 'id', sourceKey: 'locationId' });

   await sequelize.sync();


   await ProductLocation.create({ name: 'Office' });
   await ProductType.create({ name: 'Pencil' });
   await ProductCategory.create({ name: 'Supply' });


   const model = {
      id: null,
      sku: 'BLM-01',
      name: 'Blue Marker',
      ProductType: { id: 1, name: 'Pencil' },
      productTypeId: 1,
      ProductCategory: { id: 1, name: 'Supply' },
      categoryId: 1,
      ProductLocations: [ { id: 1, name: 'Office', ProductStock: { qty: 34 } } ]
   };

   try {
      await Product.create(model, { include: [ Product.Locations ] });
   } catch (e) {
      log(e);
   }

   const product = await Product.findOne({ include: Product.ALL });

   log(product.toJSON());
  
  
  
};
