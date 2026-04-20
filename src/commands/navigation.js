import { resolve, join, parse } from 'path';
import { readdir, stat } from 'fs/promises';

export async function up(currentDir) {
  const parentDir = resolve(currentDir, '..');
  const root = parse(currentDir).root;
  
  // Don't go above root directory
  if (parentDir.length < root.length) {
    return { newDirectory: currentDir };
  }
  
  return { newDirectory: parentDir };
}

export async function cd(pathToDirectory, currentDir) {
  try {
    const newPath = pathToDirectory.startsWith('/') || /^[A-Za-z]:/.test(pathToDirectory)
      ? pathToDirectory
      : join(currentDir, pathToDirectory);
    
    const stats = await stat(newPath);
    
    if (!stats.isDirectory()) {
      return { error: 'Operation failed' };
    }
    
    return { newDirectory: newPath };
  } catch {
    return { error: 'Operation failed' };
  }
}

export async function ls(currentDir) {
  try {
    const items = await readdir(currentDir);
    const entries = [];
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stats = await stat(fullPath);
      entries.push({
        name: item,
        type: stats.isDirectory() ? 'directory' : 'file'
      });
    }
    
    // Sort: directories first, then files, alphabetically
    entries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    const output = entries.map(e => `${e.type === 'directory' ? '[DIR]' : '[FILE]'} ${e.name}`).join('\n');
    return { output };
  } catch {
    return { error: 'Operation failed' };
  }
}