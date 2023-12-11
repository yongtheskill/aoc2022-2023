const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

const times = lines[0]
  .slice(9)
  .trim()
  .split(/\s+/)
  .map((n) => Number(n));
const distances = lines[1]
  .slice(9)
  .trim()
  .split(/\s+/)
  .map((n) => Number(n));

// quadratic equation
// a = -1
// b = total time
// c = - current best time
const countWins = (totalTime, bestTime) => {
  const lowerButtonLimit = (totalTime - Math.sqrt(totalTime * totalTime - 4 * bestTime)) / 2;
  const upperButtonLimit = (totalTime + Math.sqrt(totalTime * totalTime - 4 * bestTime)) / 2;

  const lowerPressTime = Number.isInteger(lowerButtonLimit)
    ? lowerButtonLimit + 1
    : Math.ceil(lowerButtonLimit);
  const upperPressTime = Number.isInteger(upperButtonLimit)
    ? upperButtonLimit - 1
    : Math.floor(upperButtonLimit);

  return upperPressTime - lowerPressTime + 1;
};

let res = 1;
for (let i = 0; i < times.length; i++) {
  const time = times[i];
  const distance = distances[i];
  const ways = countWins(time, distance);
  res *= ways;
}

console.log(res);
