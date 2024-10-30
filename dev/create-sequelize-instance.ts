import type { Options as Sequelize6Options } from 'sequelize';
import { Sequelize as Sequelize6 } from 'sequelize';
import type { Options as Sequelize7Options, Sequelize as Sequelize7, AbstractDialect } from '@sequelize/core';
import { wrapOptions } from './wrap-options';

export function createSequelize6Instance(options?: Sequelize6Options): Sequelize6 {
  return new Sequelize6(wrapOptions(options));
}

export function createSequelize7Instance(options?: Omit<Sequelize7Options<AbstractDialect<object, object>>, "dialect">): Sequelize7 {
  // not compatible with node 10
  const { Sequelize: Sequelize7Constructor } = require('@sequelize/core');
  // @ts-expect-error -- wrapOptions expect sequelize 6.
  return new Sequelize7Constructor(wrapOptions(options, true));
}
