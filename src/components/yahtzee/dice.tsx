import "./dice.css";
import { Point } from "./yahtzeeUtil";

export const Dice = (props: { point: Point, locked: boolean, onClick: Function | undefined }) => {
    const dot = (red: boolean = false) => {
        return <div className={ `dot ${red && "dot-red"}` } />
    }

    const point = (value: Point) => {
        switch (value) {
            case 1:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        <div /><div /><div />
                        <div />{ dot(true) }<div />
                        <div /><div /><div />
                    </div>
                )
            case 2:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        { dot() }<div /><div />
                        <div /><div /><div />
                        <div /><div />{ dot() }
                    </div>
                )
            case 3:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        <div /><div />{ dot() }
                        <div />{ dot() }<div />
                        { dot() }<div /><div />
                    </div>
                )
            case 4:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        { dot(true) }<div />{ dot(true) }
                        <div /><div /><div />
                        { dot(true) }<div />{ dot(true) }
                    </div>
                )
            case 5:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        { dot() }<div />{ dot() }
                        <div />{ dot() }<div />
                        { dot() }<div />{ dot() }
                    </div>
                )
            case 6:
                return (
                    <div data-clickable={ `${props.onClick !== undefined}` } className={ `dice ${props.locked && "dice-locked"}` } onClick={ () => props.onClick ? props.onClick() : {} }>
                        { dot() }<div />{ dot() }
                        { dot() }<div />{ dot() }
                        { dot() }<div />{ dot() }
                    </div>
                )
        }
    }
    return point(props.point);
}
