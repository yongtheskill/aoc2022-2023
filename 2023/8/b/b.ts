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

let i = 0;
const startingNodeNames = [...mapNodes.keys()].filter((name) => name.substring(2) == 'A');
let currentNodes = startingNodeNames.map((name) => mapNodes.get(name)!);

while (!currentNodes.every((mapNode) => mapNode.endsWith == 'Z')) {
    const stepI = i % directionsLength;
    i++;
    const step = directions[stepI];

    if (i % 100000000 == 0) console.log(i);

    currentNodes = currentNodes.map((node) => node.takeStep(step));
}

console.log(i);
