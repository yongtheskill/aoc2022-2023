const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

class MapNode {
  name: string;
  endsWith: string;
  left: MapNode | undefined;
  right: MapNode | undefined;
  lr: { left: string; right: string };
  constructor(name: string, lr: { left: string; right: string }) {
    this.name = name;
    this.endsWith = name.substring(2);
    this.lr = lr;
  }

  updateReferences(mapNodes: Map<string, MapNode>) {
    this.left = mapNodes.get(this.lr.left);
    this.right = mapNodes.get(this.lr.right);
  }

  takeStep(direction: string): MapNode {
    if (direction == 'L') return this.left!;
    return this.right!;
  }
}

const mapNodes: Map<string, MapNode> = new Map();

const directions = lines[0].split('');
const directionsLength = directions.length;
const nodeStrings = lines.slice(2);
for (const nodeString of nodeStrings) {
  const parts = nodeString.split(' = ');
  const name = parts[0];
  const lr = parts[1].substring(1, 9).split(', ');
  const left = lr[0];
  const right = lr[1];
  mapNodes.set(name, new MapNode(name, { left: lr[0], right: lr[1] }));
}

for (const [label, node] of mapNodes) {
  node.updateReferences(mapNodes);
}

const startingNodeNames = [...mapNodes.keys()].filter((name) => name.substring(2) == 'A');

// while (!currentNodes.every((mapNode) => mapNode.endsWith == 'Z')) {
//     const stepI = i % directionsLength;
//     i++;
//     const step = directions[stepI];

//     if (i % 100000000 == 0) console.log(i);

//     currentNodes = currentNodes.map((node) => node.takeStep(step));
// }

// const loopLengths: Map<string, number> = new Map();
const loopLengths: number[] = [];

for (const startingNodeName of startingNodeNames) {
  let currentNode = mapNodes.get(startingNodeName)!;
  let i = 0;
  while (currentNode.endsWith != 'Z') {
    const stepI = i % directionsLength;
    i++;
    const step = directions[stepI];
    currentNode = currentNode.takeStep(step);
  }
  loopLengths.push(i);
}

const gcd = (a: number, b: number) => {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
};

const lcm = (a: number, b: number) => {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
};

const minLength = loopLengths.reduce((prev: number, l: number) => lcm(prev, l));

console.log(minLength);
