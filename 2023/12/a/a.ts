const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

let sum = 0;
let i = 0;
for (const line of lines) {
  if (i % 100 === 0) console.log(i.toString() + '/1000');
  i++;
  sum += processLine(line);
}
console.log(sum);

function processLine(line: string) {
  const parts = line.split(' ');
  const record = parts[0].split('');
  const numbers = parts[1].split(',').map((v) => Number(v));
  return countPossible(
    record,
    numbers,
    numbers.reduce((total: number, n: number) => total + n, 0)
  );
}

function countPossible(record: string[], numbers: number[], totalSpringCount: number): number {
  let firstUnknownId = -1;
  let unknownCount = 0;
  let knownSpringCount = 0;
  for (let i = 0; i < record.length; i++) {
    const item = record[i];
    if (item === '?') {
      unknownCount++;
      if (firstUnknownId === -1) firstUnknownId = i;
      continue;
    }
    if (item === '#') knownSpringCount++;
  }

  if (knownSpringCount > totalSpringCount) return 0;
  if (knownSpringCount === totalSpringCount) {
    // fill all unknows with empty
    const testRecord = record.map((v: string) => (v === '?' ? '.' : v));
    return isValid(testRecord, numbers) ? 1 : 0;
  }
  if (unknownCount === 0) return isValid(record, numbers) ? 1 : 0;

  const newRecord = [...record];
  newRecord[firstUnknownId] = '#';
  const ifIsSpringCount = countPossible(newRecord, numbers, totalSpringCount);
  newRecord[firstUnknownId] = '.';
  const ifIsEmptyCount = countPossible(newRecord, numbers, totalSpringCount);
  return ifIsSpringCount + ifIsEmptyCount;
}

function isValid(record: string[], numbers: number[]) {
  let prevItem = '.';
  let runLength = 0;
  let runI = 0;
  const nRuns = numbers.length;
  for (const item of record) {
    if (item === '.') {
      if (prevItem === '.') continue;
      // falling edge
      prevItem = '.';
      if (numbers[runI] === runLength) {
        if (runI === nRuns - 1) return true;
        runLength = 0;
        runI++;
        continue;
      }
      return false;
    }

    if (item === '#') {
      if (prevItem === '#') {
        runLength++;
        continue;
      }
      // rising edge
      prevItem = '#';
      runLength++;
    }
  }

  if (numbers[runI] === runLength && runI === nRuns - 1) return true;
  return false;
}
