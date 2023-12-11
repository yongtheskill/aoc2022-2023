const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

const parseNumberData = (data) => {
  const numberCount = Math.floor(data.length / 3);
  const numbers = new Set();
  for (let numberI = 0; numberI < numberCount; numberI++) {
    const stringI = numberI * 3;
    const numberString = data.substring(stringI, stringI + 3).trim();
    numbers.add(Number(numberString));
  }
  return numbers;
};

let total = 0;

for (const line of lines) {
  const data = line.split(': ')[1].split('|');
  const winningData = data[0];
  const myNumbersData = data[1];

  const winningNumbers = parseNumberData(winningData);
  const myNumbers = parseNumberData(myNumbersData);

  const intersection = [...winningNumbers].filter((i) => myNumbers.has(i));
  const intersectionCount = intersection.length;
  const score = intersectionCount == 0 ? 0 : 2 ** (intersectionCount - 1);

  total += score;
}

console.log(total);
