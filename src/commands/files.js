import { join, dirname, basename } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { stat, access, constants, writeFile, rename, unlink, mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';

export async function cat(pathToFile, currentDir) {
  const fullPath = join(currentDir, pathToFile);
  
  try {
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      return { error: 'Operation failed' };
    }
    
    const readStream = createReadStream(fullPath, 'utf8');
    
    return new Promise((resolve) => {
      let content = '';
      readStream.on('data', chunk => content += chunk);
      readStream.on('end', () => resolve({ output: content }));
      readStream.on('error', () => resolve({ error: 'Operation failed' }));
    });
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function add(newFileName, currentDir) {
  const fullPath = join(currentDir, newFileName);
  
  try {
    await writeFile(fullPath, '');
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function rn(oldPath, newName, currentDir) {
  const oldFullPath = join(currentDir, oldPath);
  const newFullPath = join(dirname(oldFullPath), newName);
  
  try {
    await rename(oldFullPath, newFullPath);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function cp(pathToFile, destDir, currentDir) {
  const sourcePath = join(currentDir, pathToFile);
  const targetDir = destDir.startsWith('/') || /^[A-Za-z]:/.test(destDir)
    ? destDir
    : join(currentDir, destDir);
  const targetPath = join(targetDir, basename(sourcePath));
  
  try {
    await access(sourcePath, constants.R_OK);
    await mkdir(targetDir, { recursive: true });
    
    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(targetPath);
    
    await pipeline(readStream, writeStream);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function mv(pathToFile, destDir, currentDir) {
  const sourcePath = join(currentDir, pathToFile);
  
  const copyResult = await cp(pathToFile, destDir, currentDir);
  if (copyResult.error) return copyResult;
  
  try {
    await unlink(sourcePath);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function rm(pathToFile, currentDir) {
  const fullPath = join(currentDir, pathToFile);
  
  try {
    await unlink(fullPath);
    return {};
  } catch {
    return { error: 'Operation failed' };
  }
}