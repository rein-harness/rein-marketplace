#!/usr/bin/env node
// Builds each item with code in TypeScript (items/<id>/src/index.ts) into the one file Rein loads,
// items/<id>/index.mjs, its dependencies included. --check fails if a committed index.mjs is stale.
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';

const check = process.argv.includes('--check');
let stale = 0;
for (const id of readdirSync('items')) {
  const entry = path.join('items', id, 'src', 'index.ts');
  if (!existsSync(entry)) continue;
  const out = path.join('items', id, 'index.mjs');
  const r = await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    write: false,
    banner: {js: `// Built from src/ by scripts/build.mjs: edit the TypeScript, then npm run build.\nimport {createRequire as __itemRequire} from 'node:module';\nconst require = __itemRequire(import.meta.url);`},
    logLevel: 'warning',
  });
  const text = r.outputFiles[0].text;
  if (check) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== text) {
      console.error(`${out} is out of date: run npm run build`);
      stale++;
    }
  } else {
    const {writeFileSync} = await import('node:fs');
    writeFileSync(out, text);
    console.log(`built ${out} (${Math.round(text.length / 1024)} KB)`);
  }
}
process.exit(stale ? 1 : 0);
