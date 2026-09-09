import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const folders = ['src', 'scripts', 'tests'];
let count = 0;
for (const folder of folders) for (const name of fs.readdirSync(folder)) {
  if (!/\.(js|mjs)$/.test(name)) continue;
  const file = `${folder}/${name}`;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) { process.stderr.write(result.stderr); process.exit(1); }
  if (/[\uFFFD\u3000]|\?{3}/.test(fs.readFileSync(file, 'utf8'))) throw new Error(`Encoding issue: ${file}`);
  count++;
}
for (const file of ['index.html', 'README.md', 'public/ATTRIBUTION.md']) {
  if (/[\uFFFD\u3000]|\?{3}/.test(fs.readFileSync(file, 'utf8'))) throw new Error(`Encoding issue: ${file}`);
}
console.log(`Syntax checked ${count} JavaScript files; UTF-8 text checks passed.`);
