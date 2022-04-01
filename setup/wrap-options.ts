import defaults from 'lodash/defaults.js';
import { CiDbConfigs } from './ci-db-configs';
import { log } from './logging';
import type { Dialect, Options } from 'sequelize';

export function wrapOptions(options: Options = {}) {
  if (!process.env.DIALECT) {
    throw new Error('Dialect is not defined! Aborting.');
  }

  const isPostgresNative = process.env.DIALECT === 'postgres-native';
  const dialect = (isPostgresNative ? 'postgres' : process.env.DIALECT) as Dialect;

  const config = CiDbConfigs[dialect];

  options.dialect = dialect;
  if (isPostgresNative) {
    options.native = true;
  }

  defaults(options, {
    logging: log,
    ...config,
  });

  // @ts-expect-error
  options.__isOptionsObject__ = true;

  return options;
}
