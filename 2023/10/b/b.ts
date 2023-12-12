const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

class FloorNode {
  symbol: string;
  coordinate: [number, number];
  connectionA: FloorNode | undefined;
  connectionB: FloorNode | undefined;
  isPipe = false;

  constructor(symbol: string, coordinate: [number, number]) {
    this.symbol = symbol;
    this.coordinate = coordinate;
  }

  get xCoord() {
    return this.coordinate[0];
  }
  get yCoord() {
    return this.coordinate[1];
  }

  hasSameCoords(other: FloorNode) {
    return other.xCoord == this.xCoord && other.yCoord == this.yCoord;
  }

  updateConnection(floorNodes: FloorNode[][]) {
    if (this.symbol == '|') {
      this.connectionA = (floorNodes[this.yCoord - 1] ?? [])[this.xCoord];
      this.connectionB = (floorNodes[this.yCoord + 1] ?? [])[this.xCoord];
      return;
    }

    if (this.symbol == '-') {
      this.connectionA = floorNodes[this.yCoord][this.xCoord - 1];
      this.connectionB = floorNodes[this.yCoord][this.xCoord + 1];
    }

    if (this.symbol == 'L') {
      this.connectionA = (floorNodes[this.yCoord - 1] ?? [])[this.xCoord];
      this.connectionB = floorNodes[this.yCoord][this.xCoord + 1];
    }

    if (this.symbol == 'J') {
      this.connectionA = (floorNodes[this.yCoord - 1] ?? [])[this.xCoord];
      this.connectionB = floorNodes[this.yCoord][this.xCoord - 1];
    }

    if (this.symbol == '7') {
      this.connectionB = floorNodes[this.yCoord][this.xCoord - 1];
      this.connectionA = (floorNodes[this.yCoord + 1] ?? [])[this.xCoord];
    }

    if (this.symbol == 'F') {
      this.connectionB = floorNodes[this.yCoord][this.xCoord + 1];
      this.connectionA = (floorNodes[this.yCoord + 1] ?? [])[this.xCoord];
    }
  }

  connectStart(floorNodes: FloorNode[][]) {
    if (this.symbol != 'S') return;
    this.isPipe = true;
    const connectedNodes: FloorNode[] = [];
    const topNode = (floorNodes[this.yCoord - 1] ?? [])[this.xCoord];
    const rightNode = floorNodes[this.yCoord][this.xCoord + 1];
    const bottomNode = (floorNodes[this.yCoord + 1] ?? [])[this.xCoord];
    const leftNode = floorNodes[this.yCoord][this.xCoord - 1];
    for (const neighbour of [topNode, rightNode, bottomNode, leftNode]) {
      if (neighbour == undefined) continue;
      if (neighbour.connectionA?.symbol === 'S' || neighbour.connectionB?.symbol === 'S')
        connectedNodes.push(neighbour);
    }
    this.connectionA = connectedNodes[0];
    this.connectionB = connectedNodes[1];
  }

  nextNode(previousNode: FloorNode) {
    this.isPipe = true;
    if (this.connectionA?.hasSameCoords(previousNode)) return this.connectionB;
    return this.connectionA;
  }

  clearNonPipe() {
    if (this.isPipe !== true) {
      this.symbol = '.';
      return;
    }

    if (this.symbol !== 'S') {
      return;
    }
    let aOffset = 0;
    let aOffsetDir = '';
    let bOffset = 0;
    let bOffsetDir = '';
    if (this.connectionA!.xCoord === this.xCoord) {
      //connection A is offset in the y direction;
      aOffsetDir = 'y';
      aOffset = this.connectionA!.yCoord - this.yCoord;
    } else {
      // connection A is offset in the x direction
      aOffsetDir = 'x';
      aOffset = this.connectionA!.xCoord - this.xCoord;
    }
    if (this.connectionB!.xCoord === this.xCoord) {
      // connection B is offset in the y direction
      bOffsetDir = 'y';
      bOffset = this.connectionB!.yCoord - this.yCoord;
    } else {
      // connection B is offset in the x direction
      bOffsetDir = 'x';
      bOffset = this.connectionB!.xCoord - this.xCoord;
    }

    if (aOffsetDir === bOffsetDir) {
      // straight line
      if (aOffsetDir === 'x') {
        this.symbol = '-';
        return;
      }
      this.symbol = '|';
      return;
    }

    const xOffset = aOffsetDir === 'x' ? aOffset : bOffset;
    const yOffset = aOffsetDir === 'y' ? aOffset : bOffset;

    if (xOffset > 0) {
      if (yOffset > 0) {
        this.symbol = 'F';
        return;
      }
      this.symbol = 'L';
      return;
    }
    if (yOffset > 0) {
      this.symbol = '7';
      return;
    }
    this.symbol = 'J';
    return;
  }
}

const floorNodes: FloorNode[][] = [];
let startNode: FloorNode;
for (let y = 0; y < lines.length; y++) {
  const line = lines[y].split('');
  const floorNodeRow: FloorNode[] = [];
  for (let x = 0; x < line.length; x++) {
    const symbol = line[x];
    const newNode = new FloorNode(symbol, [x, y]);
    if (symbol == 'S') startNode = newNode;
    floorNodeRow.push(newNode);
  }
  floorNodes.push(floorNodeRow);
}

for (let y = 0; y < floorNodes.length; y++) {
  const floorNodeRow = floorNodes[y];
  for (let x = 0; x < floorNodeRow.length; x++) {
    floorNodes[y][x].updateConnection(floorNodes);
  }
}
startNode!.connectStart(floorNodes);

//trace nodes
let previousNode = startNode!;
let currentNode = startNode!.connectionA!;
let pipeLength = 1;
while (currentNode.symbol !== 'S') {
  const nextNode = currentNode.nextNode(previousNode)!;
  previousNode = currentNode;
  currentNode = nextNode;
  pipeLength += 1;
}

// clear non-pipe nodes
for (let y = 0; y < floorNodes.length; y++) {
  const floorNodeRow = floorNodes[y];
  for (let x = 0; x < floorNodeRow.length; x++) {
    floorNodes[y][x].clearNonPipe();
  }
}

// find out inner nodes
let sum = 0;
for (let y = 0; y < floorNodes.length; y++) {
  const floorNodeRow = floorNodes[y];
  sum += countInside(y, floorNodeRow);
}

function countInside(y: number, floorNodeRow: FloorNode[]): number {
  let isIn = false;
  let pipeState = '';
  let sum = 0;
  for (let x = 0; x < floorNodeRow.length; x++) {
    const currentNode = floorNodeRow[x];
    const symbol = currentNode.symbol;
    if (symbol === '.') {
      if (isIn) {
        currentNode.symbol = 'I';
        sum += 1;
        continue;
      }
    }
    if (symbol === '-') continue;
    if (symbol === 'F' || symbol === 'L') {
      pipeState = symbol;
      continue;
    }
    if (
      (symbol === 'J' && pipeState === 'F') ||
      (symbol === '7' && pipeState === 'L') ||
      symbol === '|'
    ) {
      isIn = !isIn;
      continue;
    }
  }
  return sum;
}

console.log(sum);

// visualisation
for (let y = 0; y < floorNodes.length; y++) {
  const floorNodeRow = floorNodes[y];
  let ou = '';
  for (let x = 0; x < floorNodeRow.length; x++) {
    ou += floorNodes[y][x].symbol;
  }
  console.log(ou);
}
