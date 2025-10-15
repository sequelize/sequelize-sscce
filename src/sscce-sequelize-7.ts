import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Options,
} from "@sequelize/core";
import { createSequelize7Instance } from "../dev/create-sequelize-instance";
import { expect } from "chai";
import { PostgresDialect } from "@sequelize/postgres";
import {
  Attribute,
  AutoIncrement,
  BelongsToMany,
  HasMany,
  Index,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(["postgres"]);

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  declare name?: string;

  @HasMany(() => System, {
    foreignKey: "locationId",
    inverse: "location",
  })
  declare systems?: NonAttribute<System[]>;

  @BelongsToMany(() => Customer, {
    through: {
      model: () => CustomerLocation,
      // Only "active" relationships
      scope: { endAt: null },
    },
    foreignKey: "locationId",
    otherKey: "customerId",
    inverse: {
      as: "locations",
    },
  })
  declare customers?: NonAttribute<Customer[]>;
}

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  declare name?: CreationOptional<string | null>;

  declare locations?: NonAttribute<Location[]>;
  declare CustomerLocation?: NonAttribute<CustomerLocation>;
}

class System extends Model<
  InferAttributes<System>,
  InferCreationAttributes<System>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  declare name: string;

  @Attribute(DataTypes.INTEGER)
  declare locationId: number;
  declare location?: Location;

  @HasMany(() => FuelDelivery, {
    foreignKey: "systemId",
    inverse: "system",
  })
  declare fuelDeliveries?: FuelDelivery[];
}

class FuelDelivery extends Model<
  InferAttributes<FuelDelivery>,
  InferCreationAttributes<FuelDelivery>
> {
  @Attribute(DataTypes.INTEGER)
  @AutoIncrement
  @PrimaryKey
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  declare product: string;

  @Attribute(DataTypes.INTEGER)
  declare systemId: number;

  declare system?: System;
}

class CustomerLocation extends Model<
  InferAttributes<CustomerLocation>,
  InferCreationAttributes<CustomerLocation>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @NotNull
  declare customerId: number;

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @NotNull
  declare locationId: number;

  @Attribute(DataTypes.TEXT)
  declare relationType: string;

  @Attribute(DataTypes.DATE(6))
  @Index()
  declare endAt?: Date | null;

  declare customer?: Customer;

  declare location?: Location;
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
    models: [Customer, Location, System, FuelDelivery, CustomerLocation],
  } as Options<PostgresDialect>);

  try {
    await sequelize.sync({ force: true });

    const customer = await Customer.create({ name: "Propane Delivery Co" });
    const customer2 = await Customer.create({ name: "Kozy Operations Inc" });
    const location = await Location.create({ name: "Fuel Depot" });
    await CustomerLocation.create({
      customerId: customer.id,
      locationId: location.id,
      relationType: "primary",
    });

    await CustomerLocation.create({
      customerId: customer2.id,
      locationId: location.id,
      relationType: "secondary",
    });

    const system = await System.create({
      name: "Kozy Operations Inc",
      locationId: location.id,
    });

    console.log(system);
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
    expect(customers).to.have.length(2);
    expect(customers![0].id).to.equal(customer.id);
    expect(customers![1].id).to.equal(customer2.id);

    // Test Two

    const result2 = await Customer.findOne({
      include: [
        {
          association: "locations",

          include: [
            {
              association: "customers",
            },
          ],
        },
      ],
    });

    expect(result2).to.not.be.null;
    expect(result2!.locations).to.not.be.undefined;
    const locations = result2!.locations!;
    expect(locations).to.have.length.greaterThan(0);
    expect(locations[0].customers).to.not.be.undefined;
    expect(locations[0].customers).to.have.length.greaterThan(0);

    const result3 = await FuelDelivery.findByPk(delivery.id, {
      include: [
        {
          association: "system",
          include: [
            {
              association: "location",
              include: [
                {
                  association: "customers",
                  required: true,
                  include: [
                    {
                      association: "locations",
                      required: false,
                      include: [
                        {
                          association: "systems",
                          where: { name: "Kozy Operations Inc" },
                          required: true,
                          include: [
                            {
                              association: "location",
                              include: [
                                {
                                  association: "customers",
                                  required: false,
                                  include: [
                                    {
                                      association: "locations",
                                      required: false,
                                      include: [
                                        {
                                          association: "systems",
                                          where: {
                                            name: "Kozy Operations Inc",
                                          },
                                          required: false,
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result3).to.not.be.null;
    expect(result3!.system).to.not.be.undefined;
    expect(result3!.system!.location).to.not.be.undefined;

    const customers3 = result3!.system!.location!.customers;
    expect(customers3).to.not.be.undefined;
    expect(customers3).to.have.length(2);
    expect(customers3![0].id).to.equal(customer.id);
    expect(customers3![0].locations).to.not.be.undefined;
    expect(customers3![0].locations).to.have.length.greaterThan(0);
    expect(customers3![0].locations![0].systems).to.not.be.undefined;
    expect(customers3![0].locations![0].systems).to.have.length.greaterThan(0);
    expect(customers3![0].locations![0].systems![0].name).to.equal(
      "Kozy Operations Inc"
    );

    const result4 = await FuelDelivery.findByPk(delivery.id, {
      include: [
        {
          association: "system",
          include: [
            {
              association: "location",
              include: [
                {
                  association: "customers",
                  required: true,
                  include: [
                    {
                      association: "locations",
                      required: false,
                      include: [
                        {
                          association: "systems",
                          where: { name: "Kozy Operations Inc" },
                          required: true,
                          include: [
                            {
                              association: "location",
                              include: [
                                {
                                  association: "customers",
                                  required: false,
                                  include: [
                                    {
                                      association: "locations",
                                      required: true,
                                      include: [
                                        {
                                          association: "systems",
                                          where: {
                                            name: "Kozy Operations Inc",
                                          },
                                          required: false,
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result4).to.not.be.null;
    expect(result4!.system).to.not.be.undefined;
    expect(result4!.system!.location).to.not.be.undefined;

    const customers4 = result4!.system!.location!.customers;
    expect(customers4).to.not.be.undefined;
    expect(customers4).to.have.length(2);
    expect(customers4![0].id).to.equal(customer.id);
    expect(customers4![0].locations).to.not.be.undefined;
    expect(customers4![0].locations).to.have.length.greaterThan(0);
    expect(customers4![0].locations![0].systems).to.not.be.undefined;
    expect(customers4![0].locations![0].systems).to.have.length.greaterThan(0);
    expect(customers4![0].locations![0].systems![0].name).to.equal(
      "Kozy Operations Inc"
    );
  } finally {
    await sequelize.close();
  }
}
