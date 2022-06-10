import { useCallback, useEffect, useState } from "react";
import "./aStarPage.css";

const size = 10;

export const AStarPage = () => {

    const [gridsLink, setGridsLink] = useState<Array<Array<number>>>([]);
    const [hovering, setHovering] = useState(-1);

    useEffect(() => {
        let links: Array<Array<number>> = [];
        for (let i = 0; i < size * size; i++) {
            let connection = [];
            if (i - size >= 0) connection.push(i - size); // check upper cell out of bound
            if (Math.abs(i - 1) % size < i % size) connection.push(i - 1); // check left cell out of bound
            if ((i + 1) % size > i % size) connection.push(i + 1) //check right cell out of bound
            if (i + size < size * size) connection.push(i + size); // check lower cell out of bound
            links.push(connection);
        }
        setGridsLink(links);
    }, []);

    const hover = useCallback((grid: number) => {
        setHovering(grid);
    }, []);

    const unhover = useCallback(() => {
        setHovering(-1);
    }, []);

    return (
        <div id="a-star-page">
            <div id="a-star-container">
                {
                    Array(100).fill("").map((_e, i) => <div className={ `a-star-cell${hovering >= 0 && gridsLink[hovering].includes(i) ? "-neighbour" : ""}` } key={ i } onMouseEnter={ hover.bind(AStarPage, i) } onMouseLeave={ unhover }>{ `${i}`.padStart(2, "0") }</div>)
                }
            </div>
        </div>
    )
}
