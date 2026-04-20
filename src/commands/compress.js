import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { stat, mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';

export async function compress(source, destination, currentDir) {
  const sourcePath = join(currentDir, source);
  let destPath = destination.startsWith('/') || /^[A-Za-z]:/.test(destination)
    ? destination
    : join(currentDir, destination);
  
  // Add .br extension if not present
  if (!destPath.endsWith('.br')) {
    destPath += '.br';
  }
  
  try {
    const stats = await stat(sourcePath);
    if (stats.isDirectory()) {
      return { error: 'Operation failed' };
    }
    
    await mkdir(dirname(destPath), { recursive: true });
    
    const readStream = createReadStream(sourcePath);
    const brotli = createBrotliCompress();
    const writeStream = createWriteStream(destPath);
    
    await pipeline(readStream, brotli, writeStream);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function decompress(source, destination, currentDir) {
  const sourcePath = join(currentDir, source);
  let destPath = destination.startsWith('/') || /^[A-Za-z]:/.test(destination)
    ? destination
    : join(currentDir, destination);
  
  // Remove .br extension if present
  if (destPath.endsWith('.br')) {
    destPath = destPath.slice(0, -3);
  }
  
  try {
    const stats = await stat(sourcePath);
    if (stats.isDirectory()) {
      return { error: 'Operation failed' };
    }
    
    await mkdir(dirname(destPath), { recursive: true });
    
    const readStream = createReadStream(sourcePath);
    const brotli = createBrotliDecompress();
    const writeStream = createWriteStream(destPath);
    
    await pipeline(readStream, brotli, writeStream);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}