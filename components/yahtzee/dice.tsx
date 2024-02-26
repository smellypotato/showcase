import "./dice.css";
import { Point } from "./yahtzeeUtil";

const Value: Map<Point, Array<number>> = new Map([
    [1, [4]],
    [2, [0, 8]],
    [3, [2, 4, 6]],
    [4, [0, 2, 6, 8]],
    [5, [0, 2, 4, 6, 8]],
    [6, [0, 2, 3, 5, 6, 8]]
])

export const Dice = (props: { point: Point, locked: boolean, onClick: Function | undefined }) => {
    const dot = (red: boolean = false) => {
        return <div className={ `dot ${red && "dot-red"}` } />
    }

    const point = (value: Point) => {
        return (
            <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                { new Array(9).fill(null).map((_grid, i) => Value.get(value)!.includes(i) ? dot(value === 1 || value === 4) : <div />)}
            </div>
        )
    }
    return point(props.point);
}
