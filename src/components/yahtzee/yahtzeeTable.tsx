import "./yahtzeeTable.css";
import { YAHTZEE_TYPE } from "./yahtzeeUtil";

const upperRows = [
    { name: "Aces(1點)", type: YAHTZEE_TYPE.ACES },
    { name: "Twos(2點)", type: YAHTZEE_TYPE.TWOS },
    { name: "Threes(3點)", type: YAHTZEE_TYPE.THREES },
    { name: "Fours(4點)", type: YAHTZEE_TYPE.FOURS },
    { name: "Fives(5點)", type: YAHTZEE_TYPE.FIVES },
    { name: "Sixes(6點)", type: YAHTZEE_TYPE.SIXS },
];

const lowerRows = [
    { name: "3 of a Kind (三條)", type: YAHTZEE_TYPE.THREE_OF_A_KIND },
    { name: "4 of a Kind (四條)", type: YAHTZEE_TYPE.FOUR_OF_A_KIND },
    { name: "Full House (葫蘆)", type: YAHTZEE_TYPE.FULL_HOUSE },
    { name: "Small Straight (小順)", type: YAHTZEE_TYPE.SMALL_STRAIGHT },
    { name: "Large Straight (大順)", type: YAHTZEE_TYPE.LARGE_STRAIGHT },
    { name: "YAHTZEE (五條)", type: YAHTZEE_TYPE.YAHTZEE },
    { name: "Chance (機會)", type: YAHTZEE_TYPE.CHANCE }
]

export const YahtzeeTable = (props: { combinations: Map<YAHTZEE_TYPE, number>, onSelectRow: ((key:YAHTZEE_TYPE) => void) | null }) => {
    const getCombinationValue = (type: YAHTZEE_TYPE) => {
        return props.combinations.get(type)! === -Infinity ? 0 : props.combinations.get(type);
    }
    const getValue = (type: YAHTZEE_TYPE) => {
        return props.combinations.get(type)!;
    }
    const getDisplay = (type: YAHTZEE_TYPE) => {
        return ((props.onSelectRow || (!props.onSelectRow && getValue(type)! < 0)) && getCombinationValue(type));
    }
    const onClick = (type: YAHTZEE_TYPE) => {
        return props.onSelectRow ? props.onSelectRow!(type) : undefined
    }
    return (
        <div className="yahtzee-table">
            <table>
                <tbody>
                    { upperRows.map(row => (
                        <tr key={ row.type }>
                            <th>{ row.name }</th>
                            <td className={ `yahtzee-table-${props.onSelectRow && getValue(row.type) >= 0 ? "highlight" : getValue(row.type) < 0 ? "fixed" : "cell"}` } onClick={ () => onClick(row.type) }>{ getDisplay(row.type) }</td>
                        </tr>
                    ))}
                    <tr>
                        <th>Bonus (63+) 加分 (63+)</th>
                        <td>{ getDisplay(YAHTZEE_TYPE.BONUS) }</td>
                    </tr>
                    <tr>
                        <th>Total of Upper Section (上區總分)</th>
                        <td>{ Array.from(props.combinations).reduce((prev, currPair) => prev + (currPair[0] < 10 && currPair[1] < 0 ? (getDisplay(currPair[0]) || 0) : 0), 0) }</td>
                    </tr>

                </tbody>
            </table>
            <table>
                <tbody>
                    { lowerRows.map(row => (
                        <tr key={ row.type }>
                            <th>{ row.name }</th>
                            <td className={ `yahtzee-table-${props.onSelectRow && getValue(row.type) >= 0 ? "highlight" : getValue(row.type) < 0 ? "fixed" : "cell"}` } onClick={ () => onClick(row.type) }>{ getDisplay(row.type) }</td>
                        </tr>
                    ))}
                    <tr>
                        <th>Total of Lower Section (下區總分)</th>
                        <td>{ Array.from(props.combinations).reduce((prev, currPair) => prev + (currPair[0] > 10 && currPair[1] < 0 ? (getDisplay(currPair[0]) || 0) : 0), 0) }</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <th>Total (總分)</th>
                        <td>{ Array.from(props.combinations).reduce((prev, currPair) => prev + (currPair[1] < 0 ? (getDisplay(currPair[0]) || 0) : 0), 0) }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
