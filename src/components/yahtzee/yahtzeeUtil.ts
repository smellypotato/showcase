export type DiceMap = Map<Point, number>;
export type Point = 1 | 2 | 3 | 4 | 5 | 6;
export enum YAHTZEE_TYPE {
    ACES = 1,
    TWOS = 2,
    THREES = 3,
    FOURS = 4,
    FIVES = 5,
    SIXS = 6,
    BONUS = 7,
    THREE_OF_A_KIND = 11,
    FOUR_OF_A_KIND = 12,
    FULL_HOUSE = 13,
    SMALL_STRAIGHT = 14,
    LARGE_STRAIGHT = 15,
    YAHTZEE = 16,
    CHANCE = 17,
    YAHTZEE_BONUS = 18
}
export default class YahtzeeUtil {
    static getDiceMap = (dices: Array<Point>): DiceMap => {
        let map: DiceMap = new Map();
        for (let i = 1; i <= 6; i++) {
            map.set(i as Point, dices.filter(dice => dice === i).length);
        }
        return map;
    }

    static getPoints(dices: DiceMap) {
        let points: Map<YAHTZEE_TYPE, number> = new Map();
        for (let i = 1; i <= 6; i++) {
            points.set(i, dices.get(i as Point)! * i);
        }
        return points;
    }

    static getSum(dices: DiceMap): number {
        return Array.from(dices.keys()).reduce((sum, point, i) => sum + point * dices.get(i + 1 as Point)!, 0);
    }

    static getCombination(dices: DiceMap): Map<YAHTZEE_TYPE, number> {
        let combinations: Map<YAHTZEE_TYPE, number> = new Map();
        combinations.set(YAHTZEE_TYPE.THREE_OF_A_KIND, this.isThreeOfAKind(dices) ? this.getSum(dices) : 0);
        combinations.set(YAHTZEE_TYPE.FOUR_OF_A_KIND, this.isFourOfAKind(dices) ? this.getSum(dices) : 0);
        combinations.set(YAHTZEE_TYPE.FULL_HOUSE, this.isFullHouse(dices) ? 25 : 0);
        combinations.set(YAHTZEE_TYPE.SMALL_STRAIGHT, this.isSmallStraight(dices) ? 30 : 0);
        combinations.set(YAHTZEE_TYPE.LARGE_STRAIGHT, this.isLargeStraight(dices) ? 40 : 0);
        combinations.set(YAHTZEE_TYPE.YAHTZEE, this.isYahtzee(dices) ? 50 : 0);
        combinations.set(YAHTZEE_TYPE.CHANCE, this.getSum(dices));
        return combinations;
    }

    private static isThreeOfAKind(dices: DiceMap) {
        return Array.from(dices.values()).some(value => value >= 3) // convert values to array and check if any value >= 3
    }

    private static isFourOfAKind(dices: DiceMap) {
        return Array.from(dices.values()).some(value => value >= 4) // convert values to array and check if any value >= 4
    }

    private static isFullHouse(dices: DiceMap) {
        let counts = Array.from(dices.values());
        return counts.some(count => count === 3) && counts.some(count => count === 2) // convert values to array and check if any value === 2 and 3
        // must be only one 3 and one 2
    }

    private static isSmallStraight(dices: DiceMap) {
        let counts = Array.from(dices.values());
        // 1 3 4 5 5 bug
        return this.isLargeStraight(dices) || (counts.filter(count => count >= 1).length >= 4 && (dices.get(2) !== 0 || dices.get(5) !== 0) && dices.get(3) !== 0 && dices.get(4) !== 0);
    }

    private static isLargeStraight(dices: DiceMap) {
        let counts = Array.from(dices.values());
        return counts.filter(count => count === 1).length === 5 && (dices.get(1) === 0 || dices.get(6) === 0) && dices.get(2) !== 0 && dices.get(5) !== 0;
    }

    private static isYahtzee(dices: DiceMap) {
        let counts = Array.from(dices.values());
        return counts.some(count => count === 5);
    }
}
