const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

let sum = 0;
for (const line of lines) {
  const n = processSequence(line);
  sum += n;
}
console.log(sum);

function processSequence(line: string) {
  const nums = line.split(' ').map((n) => Number(n));
  const sequences = [nums];

  while (!sequences[sequences.length - 1].every((v) => v == 0)) {
    const nextSequence = generateNextSequence(sequences);
    if (nextSequence.length == 0) break;
    sequences.push(nextSequence);
  }

  return generatePreviousElement(sequences);
}

function generatePreviousElement(sequences: number[][]) {
  let next = sequences[0][0];
  for (let i = 1; i < sequences.length; i++) {
    const currentSequence = sequences[i];
    if (i % 2 == 0) {
      next += currentSequence[0];
      continue;
    }
    next -= currentSequence[0];
  }
  return next;
}

function generateNextSequence(sequences: number[][]) {
  const latestSequence = sequences[sequences.length - 1];
  const nextSequence = latestSequence.map((v: number, i: number) => {
    const nextN = latestSequence[i + 1];
    return nextN !== undefined ? nextN - v : 0;
  });
  return nextSequence.slice(0, nextSequence.length - 1);
}
