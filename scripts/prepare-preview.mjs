// GitHub Pages serves root files; Sites uses this generated copy.
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'script.js', 'pixel-guide.js', 'hero-video.js', 'assets', '.nojekyll']) {
  await cp(resolve(root, name), resolve(output, name), { recursive: true });
}
console.log('Web připraven ve složce dist.');
