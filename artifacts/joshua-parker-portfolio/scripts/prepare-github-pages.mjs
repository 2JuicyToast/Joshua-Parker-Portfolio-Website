import { copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(packageDir, '..', 'dist/public');

await copyFile(resolve(outputDir, 'index.html'), resolve(outputDir, '404.html'));
