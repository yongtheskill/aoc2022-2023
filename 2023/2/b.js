const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split('\n');

const countsToGamePower = (counts) => {
  return counts.red * counts.green * counts.blue;
};

const mergeCounts = (newCounts, maxCounts) => {
  for (colour in maxCounts)
    if (newCounts[colour] > maxCounts[colour]) maxCounts[colour] = newCounts[colour];
};

const countRoundColours = (round) => {
  const cubeColours = round.trim().split(', ');
  const res = { red: 0, green: 0, blue: 0 };
  for (const cubeColour of cubeColours) {
    const data = cubeColour.split(' ');
    const colour = data[1];
    const n = Number(data[0]);
    res[colour] = n;
  }
  return res;
};

const gamePower = (gameID) => {
  const s = lines[gameID];
  const gameData = s.split(':')[1].trim();
  const rounds = gameData.split(';');
  const maxCounts = { red: 0, green: 0, blue: 0 };
  for (const round of rounds) {
    const counts = countRoundColours(round);
    mergeCounts(counts, maxCounts);
  }
  return countsToGamePower(maxCounts);
};

let total = 0;

for (const gameID in lines) {
  total += gamePower(gameID);
}

console.log(total);
