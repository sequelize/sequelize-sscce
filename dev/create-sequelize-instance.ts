import type { Options as Sequelize6Options } from 'sequelize';
import { Sequelize as Sequelize6 } from 'sequelize';
import type { Options as Sequelize7Options, Sequelize as Sequelize7 } from '@sequelize/core';
import type { MsSqlDialect } from '@sequelize/mssql';
import { wrapOptions } from './wrap-options';

export function createSequelize6Instance(options?: Sequelize6Options): Sequelize6 {
  return new Sequelize6(wrapOptions(options));
}

export function createSequelize7Instance(
  options?: Omit<Sequelize7Options<MsSqlDialect>, 'dialect'>,
): Sequelize7<MsSqlDialect> {
  const { Sequelize: Sequelize7Constructor } = require('@sequelize/core');
  const { MsSqlDialect } = require('@sequelize/mssql');
  const wrappedOptions = wrapOptions(options as unknown as Sequelize6Options) as Sequelize6Options & {
    __isOptionsObject__?: boolean;
    dialectOptions?: { options?: Record<string, unknown> };
  };
  const {
    dialectOptions,
    host: server,
    password,
    username: userName,
    __isOptionsObject__,
    ...sequelizeOptions
  } = wrappedOptions;
  const connectionOptions = dialectOptions && dialectOptions.options;

  // Sequelize v7 resolves dialects and connection options from standalone dialect packages.
  return new Sequelize7Constructor({
    ...sequelizeOptions,
    ...connectionOptions,
    dialect: MsSqlDialect,
    server,
    authentication: { type: 'default', options: { userName, password } },
  });
}
