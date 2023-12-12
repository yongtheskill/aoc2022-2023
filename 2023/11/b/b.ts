const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

const galaxyMap: boolean[][] = [];
for (const line of lines) {
  const galaxyLine: boolean[] = line.split('').map((c) => c === '#');
  galaxyMap.push(galaxyLine);
}

const ixDim = galaxyMap[0].length;
const iyDim = galaxyMap.length;
const emptyColsSet = new Set([...Array(ixDim).keys()]);
const emptyRowsSet = new Set([...Array(iyDim).keys()]);

const galaxies: { x: number; y: number }[] = [];
// search for all empty lines and galaxies
for (let x = 0; x < ixDim; x++) {
  for (let y = 0; y < iyDim; y++) {
    if (galaxyMap[y][x]) {
      galaxies.push({ x, y });
      emptyColsSet.delete(x);
      emptyRowsSet.delete(y);
    }
  }
}

const emptyCols = [...emptyColsSet];
const emptyRows = [...emptyRowsSet];

// iterate through all pairs
let sum = 0;
for (let startI = 0; startI < galaxies.length; startI++) {
  for (let endI = startI + 1; endI < galaxies.length; endI++) {
    sum += calcDistance(galaxies[startI], galaxies[endI]);
  }
}

console.log(sum);

function calcDistance(from: { x: number; y: number }, to: { x: number; y: number }) {
  const expansionMultiplier = 1000000;
  const xDist = Math.abs(to.x - from.x);
  const yDist = Math.abs(to.y - from.y);

  // count number of empty rows/columns traversed
  const rowCount = countEmpty(from.y, to.y, emptyRows);
  const colCount = countEmpty(from.x, to.x, emptyCols);

  return (
    xDist + yDist + rowCount * (expansionMultiplier - 1) + colCount * (expansionMultiplier - 1)
  );
}

function countEmpty(ia: number, ib: number, emptyData: number[]) {
  const upper = Math.max(ia, ib);
  const lower = Math.min(ia, ib);

  return emptyData.reduce(
    (count: number, i: number) => count + (i > lower && i < upper ? 1 : 0),
    0
  );
}
