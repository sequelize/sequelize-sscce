import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { createSequelize7Instance } from "../dev/create-sequelize-instance";
import { expect } from "chai";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(["postgres"]);

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare customers?: Customer[];
  declare systems?: System[];
}

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare locations?: Location[];
}

class System extends Model<
  InferAttributes<System>,
  InferCreationAttributes<System>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare locationId: number;

  declare location?: Location;
  declare fuelDeliveries?: FuelDelivery[];
}

class FuelDelivery extends Model<
  InferAttributes<FuelDelivery>,
  InferCreationAttributes<FuelDelivery>
> {
  declare id: CreationOptional<number>;
  declare product: string;
  declare systemId: number;

  declare system?: System;
}

class LocationCustomer extends Model<
  InferAttributes<LocationCustomer>,
  InferCreationAttributes<LocationCustomer>
> {
  declare locationId: number;
  declare customerId: number;
}

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    minifyAliases: true,
    dialect: "postgres",
    define: {
      // Keep model definitions lean so the regression focus stays on include resolution.
      timestamps: false,
    },
  });

  Location.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "locations",
    }
  );

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "customers",
    }
  );

  System.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "systems",
    }
  );

  FuelDelivery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      systemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "fuel_deliveries",
    }
  );

  LocationCustomer.init(
    {
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: "location_customers",
    }
  );

  FuelDelivery.belongsTo(System, { as: "system", foreignKey: "systemId" });
  System.hasMany(FuelDelivery, {
    as: "fuelDeliveries",
    foreignKey: "systemId",
  });

  System.belongsTo(Location, { as: "location", foreignKey: "locationId" });
  Location.hasMany(System, { as: "systems", foreignKey: "locationId" });

  Location.belongsToMany(Customer, {
    as: "customers",
    through: LocationCustomer,
    foreignKey: "locationId",
    otherKey: "customerId",
  });
  Customer.belongsToMany(Location, {
    as: "locations",
    through: LocationCustomer,
    foreignKey: "customerId",
    otherKey: "locationId",
  });

  try {
    await sequelize.sync({ force: true });

    const customer = await Customer.create({ name: "Propane Co-op" });
    const location = await Location.create({ name: "Rural Depot" });
    await LocationCustomer.create({
      customerId: customer.id,
      locationId: location.id,
    });

    const system = await System.create({
      name: "Delivery System Alpha",
      locationId: location.id,
    });
    const delivery = await FuelDelivery.create({
      product: "Propane",
      systemId: system.id,
    });

    const result = await FuelDelivery.findByPk(delivery.id, {
      logging: console.log,
      include: [
        {
          association: "system",
          required: true,
          include: [
            {
              association: "location",
              required: true,
              include: [
                {
                  association: "customers",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result).to.not.be.null;
    expect(result!.system).to.not.be.undefined;
    expect(result!.system!.location).to.not.be.undefined;
    const customers = result!.system!.location!.customers;
    expect(customers).to.not.be.undefined;
    expect(customers).to.have.length(1);
    expect(customers![0].id).to.equal(customer.id);
  } finally {
    await sequelize.close();
  }
}
