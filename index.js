import { createInterface } from 'readline';
import { homedir } from 'os';
import { readdir } from 'fs/promises';
import { join } from 'path';

const args = process.argv.slice(2);
let username = 'User';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--username' && args[i+1]) {
    username = args[i+1];
    break;
  }
}

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${homedir()}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  
  if (input === '.exit') {
    rl.close();
    return;
  }
  
  if (input === 'ls') {
    try {
      const files = await readdir(process.cwd());
      console.log(files.join('\n'));
    } catch (err) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
  
  console.log(`You are currently in ${process.cwd()}`);
  rl.prompt();
});

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
