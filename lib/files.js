const { readFile } = require('fs');
const { promisify } = require('util');

module.exports.readFile = promisify(readFile);