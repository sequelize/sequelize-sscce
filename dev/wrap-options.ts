import defaults from "lodash/defaults.js";
import { CiDbConfigs } from "./ci-db-configs";
import { log } from "./logging";
import type {
  Dialect as Sequelize6Dialect,
  Options as Sequelize6Options,
} from "sequelize";
import type {
  Options as Sequelize7Options,
  Sequelize as Sequelize7,
} from "@sequelize/core";

export function wrapOptions(options: Sequelize6Options = {}) {
  if (!process.env.DIALECT) {
    throw new Error("Dialect is not defined! Aborting.");
  }

  const isPostgresNative = process.env.DIALECT === "postgres-native";
  const dialect = (
    isPostgresNative ? "postgres" : process.env.DIALECT
  ) as Sequelize6Dialect;

  // this fails in the CI due to mismatch between Sequelize 6 & 7. Should be resolved once we drop Sequelize 6.
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
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

export function wrapOptionsV7(options: Partial<Sequelize7Options<any>> = {}) {
  if (!process.env.DIALECT) {
    throw new Error("Dialect is not defined! Aborting.");
  }

  const isPostgresNative = process.env.DIALECT === "postgres-native";
  const dialect = isPostgresNative ? "postgres" : process.env.DIALECT;

  // Get the CI config for this dialect
  const config = CiDbConfigs[dialect as keyof typeof CiDbConfigs] as any;

  // Transform Sequelize v6-style options to v7-style
  const transformedConfig = { ...config };
  if (transformedConfig.username) {
    transformedConfig.user = transformedConfig.username;
    delete transformedConfig.username;
  }

  const finalOptions = {
    dialect: dialect,
    logging: log,
    ...transformedConfig,
    ...options,
  };

  if (isPostgresNative) {
    finalOptions.native = true;
  }

  return finalOptions;
}
