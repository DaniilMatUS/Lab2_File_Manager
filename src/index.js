import { createInterface } from 'readline';
import { homedir } from 'os';
import { parseArgs } from 'util';
import { handleCommand } from './commands/index.js';
import { displayCurrentDirectory } from './utils/helpers.js';

let currentDirectory = homedir();
let username = 'User';

// Parse command line arguments
const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    username: { type: 'string' }
  },
  strict: true
});

if (values.username) {
  username = values.username;
}

console.log(`Welcome to the File Manager, ${username}!`);
displayCurrentDirectory(currentDirectory);

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
  
  if (input) {
    const result = await handleCommand(input, currentDirectory);
    
    if (result.error) {
      console.log(result.error);
    } else if (result.newDirectory) {
      currentDirectory = result.newDirectory;
      displayCurrentDirectory(currentDirectory);
    } else if (result.output !== undefined) {
      console.log(result.output);
      displayCurrentDirectory(currentDirectory);
    } else {
      displayCurrentDirectory(currentDirectory);
    }
  } else {
    displayCurrentDirectory(currentDirectory);
  }
  
  rl.prompt();
});

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});