import { Sequelize, Options } from "sequelize/types";

declare function createSequelizeInstance(options: Options): Sequelize;

export = createSequelizeInstance;
