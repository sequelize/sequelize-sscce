import './global-adjusts.js';

import { cwd } from 'fs-jetpack';
import path from 'path';
import url from 'url';

const jetpack = cwd(path.dirname(url.fileURLToPath(import.meta.url)));
jetpack.copy('./../src/utils', './../ts-dist/utils');
