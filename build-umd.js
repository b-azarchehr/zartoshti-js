const fs = require('fs');
const { execSync }  = require('child_process');
process.env.path += require('path').delimiter + './node_modules/.bin';

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

fs.writeFileSync('x.js', "module.exports = require('./index.js');");
execSync('browserify x.js -s zartoshti -o dist/zartoshti.js');
execSync('terser dist/zartoshti.js -c -m -o dist/zartoshti.min.js');
fs.unlinkSync('x.js');