#!/usr/bin/env bash

import { createSequelize6Instance } from './create-sequelize-instance.js';

const sequelize = createSequelize6Instance();

await sequelize.authenticate();
await sequelize.close();
