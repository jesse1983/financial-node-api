/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
require('dotenv').config();

if (process.env.ENV === 'production') {
  execSync('node dist/config/seed.js');
} else {
  execSync('ts-node src/config/seed.ts');
}
