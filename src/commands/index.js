import * as navigation from './navigation.js';
import * as files from './files.js';
import * as os from './os.js';
import * as hash from './hash.js';
import * as compress from './compress.js';

export async function handleCommand(input, currentDir) {
  const parts = input.split(' ');
  const command = parts[0];
  const args = parts.slice(1);
  
  switch (command) {
    case 'up':
      return navigation.up(currentDir);
      
    case 'cd':
      if (args.length !== 1) return { error: 'Invalid input' };
      return navigation.cd(args[0], currentDir);
      
    case 'ls':
      return navigation.ls(currentDir);
      
    case 'cat':
      if (args.length !== 1) return { error: 'Invalid input' };
      return files.cat(args[0], currentDir);
      
    case 'add':
      if (args.length !== 1) return { error: 'Invalid input' };
      return files.add(args[0], currentDir);
      
    case 'rn':
      if (args.length !== 2) return { error: 'Invalid input' };
      return files.rn(args[0], args[1], currentDir);
      
    case 'cp':
      if (args.length !== 2) return { error: 'Invalid input' };
      return files.cp(args[0], args[1], currentDir);
      
    case 'mv':
      if (args.length !== 2) return { error: 'Invalid input' };
      return files.mv(args[0], args[1], currentDir);
      
    case 'rm':
      if (args.length !== 1) return { error: 'Invalid input' };
      return files.rm(args[0], currentDir);
      
    case 'os':
      if (args.length !== 1) return { error: 'Invalid input' };
      return os.getOsInfo(args[0]);
      
    case 'hash':
      if (args.length !== 1) return { error: 'Invalid input' };
      return hash.calculateHash(args[0], currentDir);
      
    case 'compress':
      if (args.length !== 2) return { error: 'Invalid input' };
      return compress.compress(args[0], args[1], currentDir);
      
    case 'decompress':
      if (args.length !== 2) return { error: 'Invalid input' };
      return compress.decompress(args[0], args[1], currentDir);
      
    default:
      return { error: 'Invalid input' };
  }
}