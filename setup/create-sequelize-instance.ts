import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';
import { wrapOptions } from './wrap-options.js';

export function createSequelizeInstance(options?: Options): Sequelize {
  return new Sequelize(wrapOptions(options));
}
