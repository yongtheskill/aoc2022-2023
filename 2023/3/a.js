const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split('\n');
const grid = lines.map((line) => line.split(''));

const isNumber = (char) => {
  if (typeof char !== 'string') return false;
  if (char.trim() === '') return false;
  return !isNaN(char);
};

// prettier-ignore
const directions = [
    [-1,  1],[ 0,  1],[ 1,  1],
    [-1,  0],         [ 1,  0],
    [-1, -1],[ 0, -1],[ 1, -1],
]

const charValid = (rowID, chID) => {
  for (const direction of directions) {
    const rowToCheck = rowID + direction[1];
    const colToCheck = chID + direction[0];
    try {
      const charToCheck = grid[rowToCheck][colToCheck];
      if (charToCheck.match(/[^\d.]/i) != null) {
        return true;
      }
    } catch {}
  }
  return false;
};

const numberIDs = [];
const getValidNumberIDs = (rowID) => {
  const row = grid[rowID];

  let previousCharWasNumber = false;
  let numberID = -1;

  const validNumberIDs = new Set();

  for (let chID = 0; chID < row.length; chID++) {
    const ch = row[chID];
    const chIsNumber = isNumber(ch);
    if (chIsNumber) {
      if (!previousCharWasNumber) {
        previousCharWasNumber = true;
        numberID += 1;
      }
    } else {
      previousCharWasNumber = false;
    }

    nID.push(numberID > -1 ? numberID.toString(16) : 'z');
    if (chIsNumber && charValid(rowID, chID)) validNumberIDs.add(numberID);
  }

  return [...validNumberIDs];
};

let total = 0;

for (let rowID = 0; rowID < lines.length; rowID++) {
  const matches = lines[rowID].match(/\d+/g);
  const numbers = (matches ? [...matches] : []).map((n) => Number(n));
  const validNumberIDs = getValidNumberIDs(rowID);

  for (const validNumberID of validNumberIDs) {
    total += numbers[validNumberID];
  }
}

console.log(total);
