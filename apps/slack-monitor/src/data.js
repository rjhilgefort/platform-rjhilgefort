import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

function dataPath(filename) {
  return join(DATA_DIR, filename);
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

/**
 * Read a JSON file from data/, returning defaultValue if it doesn't exist.
 */
export async function readJSON(filename, defaultValue) {
  try {
    const raw = await readFile(dataPath(filename), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Write a JSON file to data/.
 */
export async function writeJSON(filename, data) {
  await ensureDataDir();
  await writeFile(dataPath(filename), JSON.stringify(data, null, 2) + '\n');
}
