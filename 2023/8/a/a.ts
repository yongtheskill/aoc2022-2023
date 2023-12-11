const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

class MapNode {
    name: string;
    left: MapNode | undefined;
    right: MapNode | undefined;
    lr: { left: string; right: string };
    constructor(name: string, lr: { left: string; right: string }) {
        this.name = name;
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

const directionsLength = directions.length;
let i = 0;
let currentNode = mapNodes.get('AAA')!;
while (currentNode?.name != 'ZZZ') {
    const stepI = i % directionsLength;
    i++;
    const step = directions[stepI];
    currentNode = currentNode.takeStep(step);
}

console.log(i);
