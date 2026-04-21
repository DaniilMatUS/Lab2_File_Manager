import { program } from 'commander';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { stdin as stdinStream, stdout as stdoutStream } from 'process';
import { createTransformStream } from './streams/transformStream.js';
import { TASKS, resetLineCounter } from './tasks/index.js';

program
  .name('cli-processor')
  .description('CLI tool for processing data with various tasks')
  .version('1.0.0');

program
  .option('-i, --input <path>', 'Input file path (reads from stdin if not provided)')
  .option('-o, --output <path>', 'Output file path (writes to stdout if not provided)')
  .option('-t, --task <task>', 'Task to execute (required)');

program.parse();

const options = program.opts();

// Validate required task option
if (!options.task) {
  console.error('Error: --task option is required');
  console.error('Available tasks: uppercase, reverse, count, novowels, numberlines');
  process.exit(1);
}

// Find the task
const availableTasks = ['uppercase', 'reverse', 'count', 'novowels', 'numberlines'];
if (!availableTasks.includes(options.task)) {
  console.error(`Error: Unknown task "${options.task}"`);
  console.error('Available tasks:', availableTasks.join(', '));
  process.exit(1);
}

// Reset line counter for numberlines task
resetLineCounter();

// Function to process data
async function processData(inputStream, outputStream, taskName) {
  const task = TASKS.find(t => t.name === taskName);
  const transformStream = createTransformStream(task.transform);
  
  await pipeline(
    inputStream,
    transformStream,
    outputStream
  );
}

// Setup input stream
let inputStream;
let isFileInput = false;

if (options.input) {
  try {
    inputStream = createReadStream(options.input);
    isFileInput = true;
  } catch (err) {
    console.error(`Error: Cannot read input file "${options.input}" - ${err.message}`);
    process.exit(1);
  }
} else {
  console.log('No input file provided. Enter data (press Ctrl+C twice to finish):');
  inputStream = stdinStream;
}

// Setup output stream
let outputStream;
let isFileOutput = false;

if (options.output) {
  try {
    outputStream = createWriteStream(options.output);
    isFileOutput = true;
  } catch (err) {
    console.error(`Error: Cannot write to output file "${options.output}" - ${err.message}`);
    process.exit(1);
  }
} else {
  outputStream = stdoutStream;
}

// Execute pipeline
try {
  await processData(inputStream, outputStream, options.task);
  
  if (isFileOutput) {
    console.log(`Processing completed! Output saved to ${options.output}`);
  }
  
  // If using stdin input, keep the program alive for more input
  if (!isFileInput) {
    console.log('\nProcessing completed! Enter more data (or press Ctrl+C to exit):');
    // Reset for next input
    process.stdin.resume();
  } else {
    process.exit(0);
  }
} catch (err) {
  if (err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
    console.error(`Error during processing: ${err.message}`);
    process.exit(1);
  }
}
