import { Sequelize, Options } from 'sequelize';

import { wrapOptions}  from '../../setup/wrap-options.js';

export function createSequelizeInstance(options: Options): Sequelize {
  return new Sequelize(wrapOptions(options));
};
