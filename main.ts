// NusaData hand-in program (Node 22, standard library only).
//
// The site is plain static files in app/ next to this file. This program
// hands it in: it copies app/ and screenshots/ into the output directory
// and writes output/dossier.json with the kit's vendored library
// (vendor/makefun-frontend.ts, unchanged). Outside the grader, the
// MAKEFUN_OUTPUT_DIR environment variable stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The program writes the same bytes on every run: it copies files as they
// are and the dossier is a pure function of those files.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(root, 'app');
const shotsDir = join(root, 'screenshots');

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
