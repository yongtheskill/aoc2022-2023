const fs = require('fs');

const f: string = fs.readFileSync('./in.txt').toString();
const lines = f.split(/\r?\n/);

const cardScores: Map<string, number> = new Map([
    ['A', 12],
    ['K', 11],
    ['Q', 10],
    ['T', 9],
    ['9', 8],
    ['8', 7],
    ['7', 6],
    ['6', 5],
    ['5', 4],
    ['4', 3],
    ['3', 2],
    ['2', 1],
    ['J', 0],
]);

class Hand {
    cards: string[];
    bid: number;
    typeScore: number;
    rank: number = 0;
    constructor(cards: string[], bid: number) {
        this.cards = cards;
        this.bid = bid;
        this.typeScore = this.calcTypeScore();
    }

    calculateScore(): number {
        return this.rank * this.bid;
    }

    compareWith(other: Hand): number {
        // > 0 means i win
        const typeDiff = this.typeScore - other.typeScore;
        if (typeDiff != 0) return typeDiff;

        for (let i = 0; i < 5; i++) {
            const myScore = cardScores.get(this.cards[i]);
            const otherScore = cardScores.get(other.cards[i]);
            const scoreDiff = myScore! - otherScore!;
            if (scoreDiff != 0) return scoreDiff;
        }
        return 0;
    }

    calcTypeScore(): number {
        const cardCounts: Map<string, number> = new Map();
        for (const card of this.cards) {
            if (cardCounts.has(card)) {
                cardCounts.set(card, cardCounts.get(card)! + 1);
                continue;
            }
            cardCounts.set(card, 1);
        }

        // update card map for jokers
        const jokerCount = cardCounts.get('J');
        if (jokerCount) {
            cardCounts.delete('J');
            let highestCount = 0;
            let highestCard = '';
            for (const [card, count] of cardCounts.entries()) {
                if (count <= highestCount) continue;
                highestCard = card;
                highestCount = count;
            }
            cardCounts.set(highestCard, highestCount + jokerCount);
        }

        const counts: number[] = [...cardCounts.values()];
        // five of a kind
        if (counts.length == 1) return 6;
        // four of a kind / full house
        if (counts.length == 2) {
            if (counts.some((c) => c == 4)) return 5;
            return 4;
        }
        // three of a kind / two pair
        if (counts.length == 3) {
            if (counts.some((c) => c == 3)) return 3;
            return 2;
        }
        // one pair
        if (counts.length == 4) return 1;
        // high card
        return 0;
    }
}

const hands: Hand[] = [];
for (const line of lines) {
    const lineData = line.trim().split(' ');
    const hand = new Hand(lineData[0].split(''), Number(lineData[1]));
    hands.push(hand);
}

// ascending rank order
hands.sort((a, b) => a.compareWith(b));

let total = 0;
for (let i = 0; i < hands.length; i++) {
    const rank = i + 1;
    hands[i].rank = rank;
    const winnings = hands[i].rank * hands[i].bid;
    total += winnings;
}

console.log(total);
