// Postbuild: copy functions/ into dist/functions/ for wrangler pages deploy

import { cpSync, rmSync, existsSync } from 'node:fs';

if (!existsSync('functions')) {
  console.log('  (no functions/ directory — skipping)');
  process.exit(0);
}

rmSync('dist/functions', { recursive: true, force: true });
cpSync('functions', 'dist/functions', { recursive: true });
console.log('  ✓ Bundled functions/ into dist/functions/');
