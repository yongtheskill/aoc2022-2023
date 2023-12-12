const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

const startTime = performance.now();
let sum = 0;
let i = 0;
for (const line of lines) {
  if (i % 100 === 0) console.log(i.toString() + '/1000');
  i++;
  sum += processLine(line);
}
const endTime = performance.now();
console.log(sum);
console.log(`took ${Math.floor(endTime - startTime)}ms`);

function processLine(line: string) {
  const parts = line.split(' ');
  // unfold
  const unfoldedRecordString = new Array(5).fill(parts[0]).join('?');
  const unfoldedNumbersString = new Array(5).fill(parts[1]).join(',');
  const record = unfoldedRecordString.split('');
  const numbers = unfoldedNumbersString.split(',').map((v) => Number(v));
  const cache: Map<string, number> = new Map();
  return cachedCountPossible(record, 0, -1, numbers, cache);
}

function cachedCountPossible(
  record: string[],
  runLength: number,
  runI: number,
  numbers: number[],
  cache: Map<string, number>
): number {
  const cacheIndex = `${record.join()}:${runLength}:${runI}`;
  const cachedValue = cache.get(cacheIndex);
  if (cachedValue !== undefined) {
    return cachedValue;
  }
  const value = countPossible(record, runLength, runI, numbers, cache);
  cache.set(cacheIndex, value);
  return value;
}

function countPossible(
  record: string[],
  runLength: number,
  runI: number,
  numbers: number[],
  cache: Map<string, number>
): number {
  if (record.length === 0) {
    if (runLength !== 0 && runLength !== numbers[runI]) return 0; // if ended on spring, check if last run was correct length
    if (runI < numbers.length - 1) return 0; // if havent filled all numbers
    return 1;
  }

  const charToProcess = record[0];
  const newRecord = record.slice(1);

  const processBlank = () => {
    if (runLength !== 0) {
      // falling edge
      if (runLength !== numbers[runI]) return 0;
    }
    return cachedCountPossible(newRecord, 0, runI, numbers, cache);
  };

  const processSpring = () => {
    let newRunI = runI;
    if (runLength === 0) {
      // rising edge
      newRunI++;
      if (newRunI === numbers.length) return 0;
    }
    let newRunLength = runLength;
    newRunLength++;
    if (newRunLength > numbers[runI]) return 0;
    return cachedCountPossible(newRecord, newRunLength, newRunI, numbers, cache);
  };

  if (charToProcess === '.') {
    return processBlank();
  }

  if (charToProcess === '#') {
    return processSpring();
  }

  return processBlank() + processSpring();
}
