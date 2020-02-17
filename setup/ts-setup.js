'use strict';

require('./global-adjusts');

const jetpack = require('fs-jetpack').cwd(__dirname);

jetpack.copy('./../src/utils', './../ts-dist/utils');
