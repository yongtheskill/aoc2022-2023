const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split('\n');

const cubeCount = {
  red: 12,
  green: 13,
  blue: 14,
};

const cubeColourValid = (colour, count) => {
  return count <= cubeCount[colour];
};

const roundValid = (round) => {
  const cubeColours = round.trim().split(', ');
  for (const cubeColour of cubeColours) {
    const data = cubeColour.split(' ');
    const colour = data[1];
    const n = Number(data[0]);
    if (!cubeColourValid(colour, n)) return false;
  }
  return true;
};

const gameValid = (gameID) => {
  const s = lines[gameID];
  const gameData = s.split(':')[1].trim();
  const rounds = gameData.split(';');
  for (const round of rounds) {
    if (!roundValid(round)) return false;
  }
  return true;
};

let total = 0;

for (const gameID in lines) {
  if (gameValid(gameID)) total += Number(gameID) + 1;
}

console.log(total);
