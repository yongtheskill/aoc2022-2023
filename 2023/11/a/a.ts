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
// search for all galaxies and empty lines
for (let x = 0; x < ixDim; x++) {
  for (let y = 0; y < iyDim; y++) {
    if (galaxyMap[y][x]) {
      emptyColsSet.delete(x);
      emptyRowsSet.delete(y);
    }
  }
}

const xDim = ixDim + emptyColsSet.size;
const yDim = iyDim + emptyRowsSet.size;
const emptyCols = [...emptyColsSet];
const emptyRows = [...emptyRowsSet];
// insert columns first
for (let i = 0; i < emptyCols.length; i++) {
  const insertionIndex = emptyCols[i] + i;
  for (const galaxyRow of galaxyMap) {
    galaxyRow.splice(insertionIndex, 0, false);
  }
}
// then insert rows, at expanded size
for (let i = 0; i < emptyRows.length; i++) {
  const insertionIndex = emptyRows[i] + i;
  const newRow = new Array(xDim).fill(false);
  galaxyMap.splice(insertionIndex, 0, newRow);
}

// find all galaxies
for (let y = 0; y < yDim; y++) {
  const galaxyMapRow = galaxyMap[y];
  for (let x = 0; x < xDim; x++) {
    if (galaxyMapRow[x]) {
      galaxies.push({ x, y });
    }
  }
}

// iterate through all pairs
let sum = 0;
for (let startI = 0; startI < galaxies.length; startI++) {
  for (let endI = startI + 1; endI < galaxies.length; endI++) {
    sum += calcDistance(galaxies[startI], galaxies[endI]);
  }
}

console.log(sum);

function calcDistance(from: { x: number; y: number }, to: { x: number; y: number }) {
  const xDist = Math.abs(to.x - from.x);
  const yDist = Math.abs(to.y - from.y);
  return xDist + yDist;
}
