const fs = require('fs');
const scripts_path = './js';
const output_file = './build/main.js';
const files = [];
console.log(`Reading content from ${scripts_path}...`);
fs.readdirSync(scripts_path, {}).forEach((filename) => {
  console.log(`\t${filename}`);
  files.push(fs.readFileSync(`${scripts_path}/${filename}`, { encoding: 'utf8' }));
});
console.log(`Writing content to file ${output_file}...`);
fs.writeFileSync(output_file, files.join('\n'), { encoding: 'utf8' });
console.log('Done');
