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

const cardCounts = Array(lines.length).fill(1);
for (let lineI = 0; lineI < lines.length; lineI++) {
  const line = lines[lineI];
  const data = line.split(': ')[1].split('|');
  const winningData = data[0];
  const myNumbersData = data[1];

  const winningNumbers = parseNumberData(winningData);
  const myNumbers = parseNumberData(myNumbersData);

  const intersection = [...winningNumbers].filter((i) => myNumbers.has(i));
  const intersectionCount = intersection.length;

  const currentCardCount = cardCounts[lineI];
  for (let cardOffset = 0; cardOffset < intersectionCount; cardOffset++) {
    cardCounts[lineI + cardOffset + 1] += currentCardCount;
  }
}

console.log(cardCounts.reduce((acc, cardCount) => acc + cardCount, 0));
