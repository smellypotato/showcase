import "./snake.css";
import { BodyType, DIRECTION, PointType, SnakeType } from "./snakePage";

export const Snake = (props: { col: number, row: number, snake: SnakeType, direction: DIRECTION, target: undefined | PointType }) => {

    const isBody = (grid: PointType) => {
        return props.snake.length > 0 && props.snake.find(coor => `${coor[1][0]}_${coor[1][1]}` === `${grid[0]}_${grid[1]}`);
    }

    const bodyIndex = (grid: PointType) => {
        return props.snake.length > 0 && props.snake.findIndex(coor => `${coor[1][0]}_${coor[1][1]}` === `${grid[0]}_${grid[1]}`);
    }

    const isHead = (grid: PointType) => {
        return props.snake.length > 0 && `${props.snake[0][1][0]}_${props.snake[0][1][1]}` === `${grid[0]}_${grid[1]}` ? `snake-head-${props.direction}` : "";
    }

    const isTarget = (grid: PointType) => {
        return props.target && props.target.every((value, i) => value === grid[i]);
    }

    const isBodyCorner = (currIdx: number) => {
        let className = "snake-body"
        if (currIdx < props.snake.length - 1) {
            let prevPt = props.snake[currIdx][0];
            let currPt = props.snake[currIdx][1];
            let nextPt = props.snake[currIdx + 1][1];
            if ((prevPt[1] > currPt[1] && currPt[0] < nextPt[0]) || (prevPt[0] > currPt[0] && currPt[1] < nextPt[1])) className += "-topleft";
            else if ((prevPt[1] > currPt[1] && currPt[0] > nextPt[0]) || (prevPt[0] < currPt[0] && currPt[1] < nextPt[1])) className += "-bottomleft";
            else if ((prevPt[1] < currPt[1] && currPt[0] < nextPt[0]) || (prevPt[0] > currPt[0] && currPt[1] > nextPt[1])) className += "-topright";
            else if ((prevPt[1] < currPt[1] && currPt[0] > nextPt[0]) || (prevPt[0] < currPt[0] && currPt[1] > nextPt[1])) className += "-bottomright";

        }
        return className;
    }

    return (
        <div id="snake" style={ { gridTemplateColumns: `repeat(${props.col}, 1fr)`, gridTemplateRows: `repeat(${props.row}, 1fr)` } }>
            { new Array(props.row).fill(null).map((_r, i) =>
                new Array(props.col).fill(null).map((_c, j) =>
                    <div key={`${i}_${j}`}>
                        { isBody([i, j]) && <div key={ `${i}_${j}`} id={ isHead([i, j]) } className={ isBodyCorner(bodyIndex([i, j]) as number) } /> }
                        { isTarget([i, j]) && <div id={ "snake-target" } /> }
                    </div>
                )
            )}
        </div>
    )
}
