#!/usr/bin/env bash

import { createSequelizeInstance } from './create-sequelize-instance.js';

const sequelize = createSequelizeInstance();

await sequelize.authenticate();
await sequelize.close();
