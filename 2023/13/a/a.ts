const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const grids = f.split(/\r?\n\r?\n/);

let sum = 0;
for (const gridText of grids) {
    sum += processGrid(gridText);
}
console.log(sum);

function processGrid(gridText: string) {
    const rows = gridText.split(/\r?\n/);
    const rowArr = rows.map((r) => r.split(''));
    const cols: string[] = [];

    for (let i = 0; i < rowArr[0].length; i++) {
        const col = rowArr.map((r) => r[i]).join('');
        cols.push(col);
    }

    const rowMirror = findMirror(rows);
    if (rowMirror !== 0) return rowMirror * 100;
    return findMirror(cols);
}

function findMirror(lines: string[]) {
    for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i] !== lines[i + 1]) continue;
        // start searching out
        if (validatePair(lines, i)) return i + 1;
    }
    return 0;
}

function validatePair(lines: string[], i: number) {
    const isAfterHalf = i + 1 > lines.length / 2;
    const searchCount = isAfterHalf ? lines.length - (i + 1) - 1 : i;
    for (let search = 1; search <= searchCount; search++) {
        const firstRow = lines[i - search];
        const secondRow = lines[i + search + 1];
        if (firstRow !== secondRow) return false;
    }
    return true;
}
