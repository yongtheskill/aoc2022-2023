const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

class RangeMap {
  constructor(fromItemType, toItemType, fromIdStart, toIdStart, length) {
    this.fromItemType = fromItemType;
    this.toItemType = toItemType;
    this.fromIdStart = fromIdStart;
    this.toIdStart = toIdStart;
    this.length = length;
  }

  /**
   * @param {number} fromId
   * @returns {number}
   */
  traceFromId(fromId) {
    if (fromId >= this.fromIdStart && fromId < this.fromIdStart + this.length) {
      const offset = fromId - this.fromIdStart;
      return this.toIdStart + offset;
    }
    return -1;
  }
}

class RangeMapCollection {
  /**
   * @param {RangeMap} firstRangeMap
   * @param {string} fromItemType
   * @param {string} toItemType
   */
  constructor(firstRangeMap, fromItemType, toItemType) {
    /**
     * @type {RangeMap[]}
     * @public
     */
    this.rangeMaps = [];
    this.rangeMaps.push(firstRangeMap);
    /** @type {string} */
    this.fromItemType = fromItemType;
    /** @type {string} */
    this.toItemType = toItemType;
  }

  /**
   * @param {number} fromId
   */
  getNextItemTypeAndId(fromId) {
    for (const rangeMap of this.rangeMaps) {
      const res = rangeMap.traceFromId(fromId);
      if (res != -1) {
        return { toId: res, toType: this.toItemType };
      }
    }
    return { toId: fromId, toType: this.toItemType };
  }
}

/** @type {Map<string, RangeMapCollection>} */
const rangeMapCollections = {};

/** @param {RangeMap} rangeMap */
const addRangeMapToLibrary = (rangeMap) => {
  const fromItem = rangeMap.fromItemType;
  if (fromItem in rangeMapCollections) {
    rangeMapCollections[fromItem].rangeMaps.push(rangeMap);
    return;
  }
  rangeMapCollections[fromItem] = new RangeMapCollection(
    rangeMap,
    rangeMap.fromItemType,
    rangeMap.toItemType
  );
};

const seedIds = lines[0].split(': ')[1].split(' ');

const data = f.split('map:').map((m) => m.trim().split(/\r?\n/));

for (let i = 1; i < data.length; i++) {
  const previousData = data[i - 1];
  const labelData = previousData[previousData.length - 1].split('-to-');
  const fromItem = labelData[0];
  const toItem = labelData[1];

  const currentItem = data[i];
  const isLast = i == data.length - 1;
  const mapStrings = isLast ? currentItem : currentItem.slice(0, currentItem.length - 2);
  for (const mapString of mapStrings) {
    const mapData = mapString.split(' ').map((m) => Number(m));
    const newRangeMap = new RangeMap(fromItem, toItem, mapData[1], mapData[0], mapData[2]);
    addRangeMapToLibrary(newRangeMap);
  }
}

/** @param {number} seedId */
const traceSeed = (seedId) => {
  let currentItemType = 'seed';
  let currentId = seedId;
  while (currentItemType != 'location') {
    const nextData = rangeMapCollections[currentItemType].getNextItemTypeAndId(currentId);
    currentItemType = nextData.toType;
    currentId = nextData.toId;
  }
  return currentId;
};

const locationIds = [];
for (const seedId of seedIds) {
  locationIds.push(traceSeed(seedId));
}

console.log(Math.min(...locationIds));
