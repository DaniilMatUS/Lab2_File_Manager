// Task 1: Convert text to uppercase
function toUpperCase(text) {
  return text.toUpperCase();
}

// Task 2: Reverse string
function reverseString(text) {
  return text.split('').reverse().join('');
}

// Task 3: Count characters
function countCharacters(text) {
  return `${text}: ${text.length} characters`;
}

// Task 4: Remove vowels
function removeVowels(text) {
  return text.replace(/[aeiouAEIOU]/g, '');
}

// Task 5: Add line numbers
let lineNumber = 1;
function addLineNumbers(text) {
  const result = `${lineNumber}: ${text}`;
  lineNumber++;
  return result;
}

// Reset line counter utility
export function resetLineCounter() {
  lineNumber = 1;
}

export const TASKS = [
  {
    name: 'uppercase',
    description: 'Convert text to uppercase',
    transform: toUpperCase
  },
  {
    name: 'reverse',
    description: 'Reverse each line of text',
    transform: reverseString
  },
  {
    name: 'count',
    description: 'Count characters in each line',
    transform: countCharacters
  },
  {
    name: 'novowels',
    description: 'Remove vowels from text',
    transform: removeVowels
  },
  {
    name: 'numberlines',
    description: 'Add line numbers to output',
    transform: addLineNumbers
  }
];
