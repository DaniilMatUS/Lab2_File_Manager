import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { stat } from 'fs/promises';

export async function calculateHash(pathToFile, currentDir) {
  const fullPath = join(currentDir, pathToFile);
  
  try {
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      return { error: 'Operation failed' };
    }
    
    const hash = createHash('sha256');
    const stream = createReadStream(fullPath);
    
    return new Promise((resolve) => {
      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve({ output: hash.digest('hex') }));
      stream.on('error', () => resolve({ error: 'Operation failed' }));
    });
  } catch {
    return { error: 'Operation failed' };
  }
}