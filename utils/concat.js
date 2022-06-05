const fs = require('fs');
const scripts_path = '../js';
const output_file = '../build/main.js';
const output_minified_file = '../build/main.js';
const files = [];

console.log(`Reading content from ${scripts_path}`);
fs.readdirSync(scripts_path, {}).forEach((filename) => {
  if (filename.indexOf('.map') !== -1) return;
  console.log(`\t${filename}`);
  files.push(fs.readFileSync(`${scripts_path}/${filename}`, {
    encoding: 'utf8'
  }));
});
console.log('[ OK ]');

console.log(`Writing content to file ${output_file}`);
fs.writeFileSync(output_file, files.join('\n'), {
  encoding: 'utf8'
});
console.log('[ OK ]');

if (process.argv[2] !== 'minify') return;

const minifier = require('node-minify');
const {
  stringify
} = require('querystring');
console.log(`Minify from ${output_file} to ${output_minified_file}`);
minifier.minify({
  compressor: 'gcc',
  input: output_file,
  output: output_minified_file,
  callback: function (err) {
    if (!err) {
      console.log('[ OK ]');
    } else {
      console.error(err);
    }
  }
});