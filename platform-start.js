/** platform-start.js */
/* eslint-disable */
const cli = require('next/dist/cli/next-start');
const config = require('platformsh-config').config();
cli.nextStart([
    '-p', config.port || 3001,
]);
