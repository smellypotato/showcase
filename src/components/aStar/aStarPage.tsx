import { useCallback, useEffect, useMemo, useState } from "react";
import "./aStarPage.css";

const size = 11;

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

    const checkClass = useCallback((grid: number) => {
        let className = "a-star-cell";
        if (hovering < 0) return className;
        let firstLayer = gridsLink[hovering];
        if (firstLayer.includes(grid)) className += "-neighbour";
        let secondLayer = gridsLink[hovering].map(neighbour => gridsLink[neighbour]).flat();
        if (secondLayer.includes(grid) && grid !== hovering) className += "-ring";
        return className;
    }, [hovering, gridsLink]);

    const aStarAlgo = useMemo(() => {
        let start = 12;
        let goal = 108
        let openSet = [start];
        let path: Array<number> = []
        let costTo: Array<number> = [];
        costTo[start] = 0;
        while (openSet.length > 0) {
            let currentCell = openSet.pop() as number;
            if (currentCell === goal) break;
            gridsLink[currentCell].forEach(neighbour => {
                let costToNeighbour = costTo[currentCell] + 1; // each path cost 1;
                if (!costTo[neighbour] || costToNeighbour < costTo[neighbour]) {
                    costTo[neighbour] = costToNeighbour;

                    openSet.push(neighbour);
                    costTo
                }
            })
        }
    }, []);

    return (
        <div id="a-star-page">
            <div id="a-star-container" style={ { gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` } }>
                {
                    Array(size * size).fill("").map((_e, i) => <div className={ checkClass(i) } key={ i } onMouseEnter={ hover.bind(AStarPage, i) } onMouseLeave={ unhover }>{ `${i}`.padStart((size * size - 1).toString().length, "0") }</div>)
                }
            </div>
        </div>
    )
}
