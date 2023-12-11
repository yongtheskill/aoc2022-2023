const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);
const grid = lines.map((line) => line.split(''));

const isNum = (char) => {
  if (typeof char !== 'string') return false;
  if (char.trim() === '') return false;
  return !isNaN(char);
};

const traceNumber = (x, y) => {
  const row = grid[y];
  if (!isNum(row[x])) return 0;
  let xv = x;
  while (isNum(row[xv])) {
    xv -= 1;
  }
  xv += 1;

  let nStr = '';
  while (isNum(row[xv])) {
    nStr = nStr.concat(row[xv]);
    xv += 1;
  }

  return Number(nStr);
};

/*
1 x x
1 1 x
1 1 1
x 1 x
x 1 1
x x 1
1 x 1
*/

const getGearRatio = (x, y) => {
  const nums = [];

  if (isNum(grid[y - 1][x - 1])) {
    nums.push(traceNumber(x - 1, y - 1));
    if (isNum(grid[y - 1][x + 1]) && !isNum(grid[y - 1][x])) {
      nums.push(traceNumber(x + 1, y - 1));
    }
  } else if (isNum(grid[y - 1][x])) {
    nums.push(traceNumber(x, y - 1));
  } else if (isNum(grid[y - 1][x + 1])) {
    nums.push(traceNumber(x + 1, y - 1));
  }

  if (isNum(grid[y][x - 1])) {
    nums.push(traceNumber(x - 1, y));
  }

  if (isNum(grid[y][x + 1])) {
    nums.push(traceNumber(x + 1, y));
  }

  if (isNum(grid[y + 1][x - 1])) {
    nums.push(traceNumber(x - 1, y + 1));
    if (isNum(grid[y + 1][x + 1]) && !isNum(grid[y + 1][x])) {
      nums.push(traceNumber(x + 1, y + 1));
    }
  } else if (isNum(grid[y + 1][x])) {
    nums.push(traceNumber(x, y + 1));
  } else if (isNum(grid[y + 1][x + 1])) {
    nums.push(traceNumber(x + 1, y + 1));
  }

  if (nums.length != 2) return 0;
  return nums[0] * nums[1];
};

// prettier-ignore
const directions = [
    [-1,  1],[ 0,  1],[ 1,  1],
    [-1,  0],         [ 1,  0],
    [-1, -1],[ 0, -1],[ 1, -1],
]

const getGearRatio2 = (x, y) => {
  const nums = new Set();

  for (const direction of directions) {
    const traced = traceNumber([x + direction[0]], [y + direction[1]]);
    if (traced) nums.add(traced);
  }

  if (nums.size != 2) return 0;
  const nArr = [...nums];
  return nArr[0] * nArr[1];
};

const totalRowGearRatio = (rowID) => {
  const row = grid[rowID];
  let rowTotal = 0;
  for (let x = 0; x < row.length; x++) if (row[x] == '*') rowTotal += getGearRatio(x, rowID);
  return rowTotal;
};

let total = 0;
for (let rowID = 0; rowID < lines.length; rowID++) {
  total += totalRowGearRatio(rowID);
}

console.log(total);
