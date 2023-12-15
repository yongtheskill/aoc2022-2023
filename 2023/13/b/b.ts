const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const grids = f.split(/\r?\n\r?\n/);

let sum = 0;
for (const gridText of grids) {
    sum += processGrid(gridText);
}
console.log(sum);

function processGrid(gridText: string) {
    const rowsText = gridText.split(/\r?\n/);
    const rowArr = rowsText.map((r) => r.split(''));
    const rows = rowsText.map((line) => line.split(''));
    const cols: string[][] = [];

    for (let i = 0; i < rowArr[0].length; i++) {
        const col = rowArr.map((r) => r[i]);
        cols.push(col);
    }

    const rowMirror = findMirror(rows);
    const colMirror = findMirror(cols);

    const rowSmudge = findSmudge(rows, rowMirror);
    if (rowSmudge !== 0) return rowSmudge * 100;
    return findSmudge(cols, colMirror);
}

function findSmudge(lines: string[][], existing: number) {
    for (let i = 0; i < lines.length - 1; i++) {
        if (i === existing) continue;
        if (smudgePair(lines, i)) return i + 1;
    }
    return 0;
}

function smudgePair(lines: string[][], i: number) {
    const isAfterHalf = i + 1 > lines.length / 2;
    const searchCount = isAfterHalf ? lines.length - (i + 1) - 1 : i;
    let smudgeFound = false;
    for (let search = 0; search <= searchCount; search++) {
        const firstLine = lines[i - search];
        const secondLine = lines[i + search + 1];
        const matchResult = matchSmudge(firstLine, secondLine);
        if (matchResult === 'no') return false;
        if (matchResult === 'smudge') {
            if (smudgeFound) return false;
            smudgeFound = true;
        }
    }
    return true;
}

function matchSmudge(firstLine: string[], secondLine: string[]): 'no' | 'smudge' | 'match' {
    let smudgeFound = false;
    for (let i = 0; i < firstLine.length; i++) {
        if (firstLine[i] === secondLine[i]) continue;
        if (smudgeFound) return 'no';
        smudgeFound = true;
    }
    return smudgeFound ? 'smudge' : 'match';
}

//
//
//
//
//
//
//
//
//
//
//
//
//

function findMirror(lines: string[][]) {
    for (let i = 0; i < lines.length - 1; i++) {
        if (mirrorPair(lines, i)) return i;
    }
    return -1;
}

function mirrorPair(lines: string[][], i: number) {
    const isAfterHalf = i + 1 > lines.length / 2;
    const searchCount = isAfterHalf ? lines.length - (i + 1) - 1 : i;
    for (let search = 0; search <= searchCount; search++) {
        const firstLine = lines[i - search];
        const secondLine = lines[i + search + 1];
        if (!matchPair(firstLine, secondLine)) return false;
    }
    return true;
}

function matchPair(firstLine: string[], secondLine: string[]) {
    for (let i = 0; i < firstLine.length; i++) {
        if (firstLine[i] !== secondLine[i]) return false;
    }
    return true;
}
