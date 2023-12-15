const fs = require('fs');

const f: string = fs.readFileSync('./test.txt').toString();
const lines = f.split(/\r?\n/).map((l) => l.split(''));

const width = lines[0].length;
const height = lines.length;

function calculateLoad(lines: string[][]) {
    let totalLoad = 0;
    for (let x = 0; x < width; x++) {
        //count column
        let currentLoad = height;
        for (let y = 0; y < height; y++) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                totalLoad += currentLoad;
                currentLoad--;
                continue;
            }
            if (currentItem === '#') {
                currentLoad = height - y - 1;
            }
        }
    }
    return totalLoad;
}

console.log(calculateLoad(lines));
