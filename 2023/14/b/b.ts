const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
let grid = f.split(/\r?\n/).map((l) => l.split(''));
const emptyGrid: string[][] = grid.map((row) => row.map((e) => (e === 'O' ? '.' : e)));
const newEmptyGrid = () => emptyGrid.map((r) => [...r]);

const width = grid[0].length;
const height = grid.length;

console.log(solve(grid));

function solve(grid: string[][]) {
    const visited: Set<number> = new Set();
    let spinCount = 0;
    const iload = calculateLoad(grid);
    visited.add(iload);
    let repeatCount = 0;
    let cycling = false;
    const hist: number[] = [];
    for (let i = 0; i < 100000; i++) {
        grid = spin(grid);
        const load = calculateLoad(grid);
        spinCount++;
        if (cycling) {
            if (load === hist[0]) {
                // calculate using found sequence
                return getSequenceN(hist, spinCount, 1000000000);
            }
            hist.push(load);
            continue;
        }
        if (!visited.has(load)) {
            visited.add(load);
            continue;
        }
        repeatCount++;
        if (repeatCount > 20) {
            // cycle started
            cycling = true;
            hist.push(load);
        }
    }
}
//printGrid(grid);
function getSequenceN(hist: number[], i: number, wanted: number) {
    const period = hist.length;
    const histOffset = (wanted - i) % period;
    return hist[histOffset];
}

function printGrid(grid: string[][]) {
    const st = grid.map((line) => line.join('')).join('\n');
    console.log(st);
}

function spin(grid: string[][]) {
    return tiltEast(tiltSouth(tiltWest(tiltNorth(grid))));
}

function tiltNorth(lines: string[][]) {
    const columns: { i: number; count: number }[][] = [];
    for (let x = 0; x < width; x++) {
        //iterate through columns
        const colData: { i: number; count: number }[] = [{ i: 0, count: 0 }];

        for (let y = 0; y < height; y++) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                colData[colData.length - 1].count++;
                continue;
            }
            if (currentItem === '#') {
                colData.push({ i: y + 1, count: 0 });
            }
        }
        columns.push(colData);
    }

    return generateLinesNorth(columns);
}

function generateLinesNorth(columns: { i: number; count: number }[][]) {
    const grid = newEmptyGrid();
    for (let x = 0; x < columns.length; x++) {
        for (const itemData of columns[x]) {
            let y = itemData.i;
            for (let i = 0; i < itemData.count; i++) grid[y + i][x] = 'O';
        }
    }
    return grid;
}

//
//

function tiltWest(lines: string[][]) {
    const rows: { i: number; count: number }[][] = [];
    for (let y = 0; y < height; y++) {
        //iterate through columns
        const rowData: { i: number; count: number }[] = [{ i: 0, count: 0 }];

        for (let x = 0; x < width; x++) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                rowData[rowData.length - 1].count++;
                continue;
            }
            if (currentItem === '#') {
                rowData.push({ i: x + 1, count: 0 });
            }
        }
        rows.push(rowData);
    }

    return generateLinesWest(rows);
}

function generateLinesWest(rows: { i: number; count: number }[][]) {
    const grid = newEmptyGrid();
    for (let y = 0; y < rows.length; y++) {
        for (const itemData of rows[y]) {
            let x = itemData.i;
            for (let i = 0; i < itemData.count; i++) grid[y][x + i] = 'O';
        }
    }
    return grid;
}

//
//

function tiltSouth(lines: string[][]) {
    const columns: { i: number; count: number }[][] = [];
    for (let x = 0; x < width; x++) {
        //iterate through columns
        const colData: { i: number; count: number }[] = [{ i: height - 1, count: 0 }];

        for (let y = height - 1; y >= 0; y--) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                colData[colData.length - 1].count++;
                continue;
            }
            if (currentItem === '#') {
                colData.push({ i: y - 1, count: 0 });
            }
        }
        columns.push(colData);
    }

    return generateLinesSouth(columns);
}

function generateLinesSouth(columns: { i: number; count: number }[][]) {
    const grid = newEmptyGrid();
    for (let x = 0; x < columns.length; x++) {
        for (const itemData of columns[x]) {
            let y = itemData.i;
            for (let i = 0; i < itemData.count; i++) grid[y - i][x] = 'O';
        }
    }
    return grid;
}

//
//

function tiltEast(lines: string[][]) {
    const rows: { i: number; count: number }[][] = [];
    for (let y = 0; y < height; y++) {
        //iterate through columns
        const rowData: { i: number; count: number }[] = [{ i: width - 1, count: 0 }];

        for (let x = width - 1; x >= 0; x--) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                rowData[rowData.length - 1].count++;
                continue;
            }
            if (currentItem === '#') {
                rowData.push({ i: x - 1, count: 0 });
            }
        }
        rows.push(rowData);
    }

    return generateLinesEast(rows);
}

function generateLinesEast(rows: { i: number; count: number }[][]) {
    const grid = newEmptyGrid();
    for (let y = 0; y < rows.length; y++) {
        for (const itemData of rows[y]) {
            let x = itemData.i;
            for (let i = 0; i < itemData.count; i++) grid[y][x - i] = 'O';
        }
    }
    return grid;
}

//

function calculateLoad(lines: string[][]) {
    const height = lines.length;
    const width = lines[0].length;
    let totalLoad = 0;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const currentItem = lines[y][x];
            if (currentItem === 'O') {
                totalLoad += height - y;
                continue;
            }
        }
    }
    return totalLoad;
}
