import { useCallback, useEffect, useRef, useState } from "react";
import { Dice } from "./dice";
import "./yahtzeePage.css";
import { YahtzeeTable } from "./yahtzeeTable";
import YahtzeeUtil, { Point, YAHTZEE_TYPE } from "./yahtzeeUtil";

const rollSpeed = 50;

type DiceInfo = {
    value: Point,
    locked: boolean
}

type Combinations = Map<YAHTZEE_TYPE, number>;

const combinationMap = (): Combinations => (
    new Map([
        [YAHTZEE_TYPE.ACES, Infinity],
        [YAHTZEE_TYPE.TWOS, Infinity],
        [YAHTZEE_TYPE.THREES, Infinity],
        [YAHTZEE_TYPE.FOURS, Infinity],
        [YAHTZEE_TYPE.FIVES, Infinity],
        [YAHTZEE_TYPE.SIXS, Infinity],
        [YAHTZEE_TYPE.BONUS, -Infinity],
        [YAHTZEE_TYPE.THREE_OF_A_KIND, Infinity],
        [YAHTZEE_TYPE.FOUR_OF_A_KIND, Infinity],
        [YAHTZEE_TYPE.FULL_HOUSE, Infinity],
        [YAHTZEE_TYPE.SMALL_STRAIGHT, Infinity],
        [YAHTZEE_TYPE.LARGE_STRAIGHT, Infinity],
        [YAHTZEE_TYPE.YAHTZEE, Infinity],
        [YAHTZEE_TYPE.CHANCE, Infinity],
        // [YAHTZEE_TYPE., 0],
        // [YAHTZEE_TYPE., 0],

    ])
)

export const YahtzeePage = () => {
    const rollingDiceRef = useRef<Array<Point>>([]);
    const [dices, setDices] = useState<Array<DiceInfo>>(rollingDiceRef.current.map(dice => { return { value: dice, locked: false } }));
    const [combinations, setCombinations] = useState<Combinations>(combinationMap());
    const [rolling, setRolling] = useState(false);
    const [rollCount, setRollCount] = useState(0);
    const [roundRunning, setRoundRunning] = useState(false);
    const rollingId = useRef(-1);

    useEffect(() => {
        updateDices([randomDice(), randomDice(), randomDice(), randomDice(), randomDice()]);
    }, []);

    useEffect(() => {
        if (dices.length === 0) return;
        if (rolling) {
            let id = window.setInterval(() => {
                let dicesClone = rollingDiceRef.current.slice();
                updateDices(dicesClone.map((dice, i) => {
                    let newPoint: Point = dice;
                    do {
                        if (!dices[i].locked) newPoint = randomDice();
                        else break;
                    } while (newPoint === dice)
                    return newPoint;
                }));
            }, rollSpeed);
            rollingId.current = id;
        }
        else stopRoll();
    }, [rolling]);

    useEffect(() => {
        rolling && setRoundRunning(true);
    }, [rolling]);

    useEffect(() => {
        console.log(combinations.get(YAHTZEE_TYPE.BONUS));
        if (roundRunning || combinations.get(YAHTZEE_TYPE.BONUS) === -35) return;
        let upperSum = checkBonus(combinations);
        console.log(upperSum);
        if (Math.abs(upperSum) >= 63) {
            let newCombination = new Map([...combinations]);
            newCombination.set(YAHTZEE_TYPE.BONUS, -35)
            setCombinations(newCombination);
        }
    }, [combinations, roundRunning]);

    const stopRoll = () => {
        clearInterval(rollingId.current);
        rollingId.current = -1;
        updateDices(rollingDiceRef.current.map((dice, i) => !dices[i].locked ? randomDice() : dice));
        // updateDices([1,1,1,1,1]);
        let diceMap = YahtzeeUtil.getDiceMap(rollingDiceRef.current);
        let newCombination: Combinations = new Map([...YahtzeeUtil.getPoints(diceMap), ...YahtzeeUtil.getCombination(diceMap)])
        newCombination.forEach((_value, key, map) => {
            if (combinations.get(key)! < 0) map.set(key, combinations.get(key)!);
        })
        newCombination.set(YAHTZEE_TYPE.BONUS, combinations.get(YAHTZEE_TYPE.BONUS)!);
        setCombinations(newCombination)
        setRollCount(rollCount + 1);
    }

    const updateDices = useCallback((newDices: Array<Point>) => {
        rollingDiceRef.current = newDices.slice();
        setDices(newDices.map((dice, i) => { return { value: dice, locked: dices[i]?.locked || false } }));
    }, [rollingDiceRef, dices]);

    const randomDice = (): Point => {
        return Math.floor(Math.random() * ((6 + 1) - 1) + 1) as Point;
    }

    const onLockDice = (i: number) => {
        let dicesClone = dices.slice();
        dicesClone[i].locked = !dicesClone[i].locked;
        setDices(dicesClone);
    }

    const onSelectRow = (key: YAHTZEE_TYPE) => {
        setRoundRunning(false);
        let value = combinations.get(key)!
        if (value < 0) return;
        let newCombination = new Map([...combinations]);
        newCombination.set(key, -value || -Infinity);
        setCombinations(newCombination);
        setRollCount(0);
        let dicesClone = [...dices];
        dicesClone.forEach(dice => dice.locked = false);
        setDices(dicesClone);
        if (!Array.from(newCombination).find(pair => pair[1] >= 0)) alert("End game");
    }

    const checkBonus = (combination: Combinations) => {
        const getValue = (type: YAHTZEE_TYPE) => combination.get(type) === -Infinity ? 0 : combination.get(type)!;
        return Array.from(combinations).reduce((prev, currPair) => prev + (currPair[0] < 10 && currPair[1] < 0 ? (getValue(currPair[0]) || 0) : 0), 0)
    }

    return (
        <div id="yahtzee-page">
            <h2 className="f_24">Yahtzee</h2>
            <div id="yahtzee-dice-roll">
                { dices.map((dice, i) => <Dice key={ i } point={ dice.value } locked={ dice.locked } onClick={ !rolling && rollCount > 0 ? onLockDice.bind(Dice, i) : undefined }/>) }
            </div>
            <div id="yahtzee-button" className="no_highlight cursor_button" onClick={ () => setRolling(rollCount < 3 && !rolling) }>Roll</div>
            <div id="yahtzee-rolls">
                { Array(3).fill(undefined).map((_n, i) => <div key={ i } className="yahtzee-roll">{ rollCount > i && <div className="yahtzee-roll-count" /> }</div>)}

            </div>
            <YahtzeeTable combinations={ combinations } onSelectRow={ rollCount > 0 ? onSelectRow : null } />
        </div>
    )
}
