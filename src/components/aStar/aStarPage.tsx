import { useCallback, useEffect, useMemo, useState } from "react";
import "./aStarPage.css";

const size = 11;

export const AStarPage = () => {

    const [gridsLink, setGridsLink] = useState<Array<Array<number>>>([]);
    const [hovering, setHovering] = useState(-1);
    const [blocks] = useState([13, 14, 15, 16, 17, 18, 19,23, 33, 46, 47, 48, 49, 50, 51, 52, 53, 54])
    const [aStarPath, setAStarPath] = useState<Array<number>>([]);
    useEffect(() => {
        let links: Array<Array<number>> = [];
        for (let i = 0; i < size * size; i++) {
            let connection = [];
            const isBlock = (cell: number) => {
                return blocks.includes(cell);
            }
            if (i - size >= 0 && !isBlock(i - size)) connection.push(i - size); // check upper cell out of bound
            if (Math.abs(i - 1) % size < i % size && !isBlock(i - 1)) connection.push(i - 1); // check left cell out of bound
            if ((i + 1) % size > i % size && !isBlock(i + 1)) connection.push(i + 1) //check right cell out of bound
            if (i + size < size * size && !isBlock(i + size)) connection.push(i + size); // check lower cell out of bound
            links.push(connection);
        }
        setGridsLink(links);
    }, []);

    const hover = useCallback((grid: number) => {
        // setHovering(grid);
    }, []);

    const unhover = useCallback(() => {
        // setHovering(-1);
    }, []);

    const aStarProcessedPath = useMemo(() => {

        if (gridsLink.length === 0) return [];

        const calculateCostFrom = (goalCell: number, currentCell: number) => {
            const goal = [goalCell % size, Math.floor(goalCell / size)];
            const current = [currentCell % size, Math.floor(currentCell / size)];
            return Math.abs(goal[0] - current[0]) + Math.abs(goal[1] - current[1]);
        }

        interface OpenCellInfo {
            cell: number,
            costTo: number, // g
            costFrom: number //h
            prevCell: number
        }
        interface ClosedCellInfo {
            cell: number,
            prevCell: number
        }
        let start = 12;
        let goal = 108
        let openSet: Array<OpenCellInfo> = [{ cell: start, costTo: 0, costFrom: calculateCostFrom(goal, start), prevCell: -1}];
        let closedSet: Array<ClosedCellInfo> = [];
        while (openSet.length > 0) {
            let currentCell = openSet.shift() as OpenCellInfo; // shift the element sorted with smallest total cost

            closedSet.unshift({ cell: currentCell.cell, prevCell: currentCell.prevCell })
            if (currentCell.cell === goal) return closedSet;
            gridsLink[currentCell.cell].filter(neighbour => !closedSet.find(cellInfo => cellInfo.cell === neighbour)).forEach(neighbour => {
                let costToNeighbour = currentCell.costTo + 1; // each path cost 1;
                let neighbourCellInfo = openSet.find(cellInfo => cellInfo.cell === neighbour);
                if (!neighbourCellInfo || costToNeighbour < neighbourCellInfo.costTo) {
                    neighbourCellInfo ?
                        Object.assign(neighbourCellInfo, { costTo: costToNeighbour, prevCell: currentCell }) :
                        openSet.unshift({ cell: neighbour, costTo: costToNeighbour, costFrom: calculateCostFrom(goal, neighbour), prevCell: currentCell.cell})
                }
            })
            openSet.sort((cellInfoA, cellInfoB) => (cellInfoA.costTo + cellInfoA.costFrom) - (cellInfoB.costTo + cellInfoB.costFrom))
        }
        return [];
    }, [gridsLink]);

    useEffect(() => {
        if (aStarProcessedPath.length === 0) return;
        let path = [];
        path.push(aStarProcessedPath[0].cell);
        let prevCell = aStarProcessedPath[0].prevCell;
        while (prevCell !== -1) {
            let prevCellInfo = aStarProcessedPath.find(cell => cell.cell === prevCell);
            path.push(prevCellInfo!.cell);
            prevCell = prevCellInfo!.prevCell;
        }
        setAStarPath(path)
    }, [aStarProcessedPath])

    const checkClass = useCallback((grid: number) => {
        let className = "a-star-cell";
        if (blocks.includes(grid)) className += "-block"
        // if (hovering < 0) return className;
        // let firstLayer = gridsLink[hovering];
        // if (firstLayer.includes(grid)) className += "-neighbour";
        // let secondLayer = gridsLink[hovering].map(neighbour => gridsLink[neighbour]).flat();
        // if (secondLayer.includes(grid) && grid !== hovering) className += "-ring";
        if (aStarProcessedPath.find(cell => cell.cell === grid)) className += "-processed";
        if (aStarPath.find(cell => cell === grid)) className += "-path";
        return className;
    }, [hovering, gridsLink, aStarProcessedPath, aStarPath]);

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
