import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../');

export function uploadDirectory(category: string) {
  return join(apiRoot, 'uploads', category);
}

export function uploadFilePath(category: string, storedName: string) {
  return join(uploadDirectory(category), storedName);
}
