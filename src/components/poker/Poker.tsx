import { useEffect, useRef, useState } from "react";
import "./Poker.css";

const defaultStartingSides = {left: false, top: false, right: false, bottom: false};
export const Poker = (props: {verticalCenterSize?: number, horizontalCenterSize?: number}) => {
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [startingSides, setStartingSides] = useState({...defaultStartingSides});
    const [offset, setOffset] = useState<{top?: string, bottom?: string, left?: string, right?: string}>({});
    const [anchor, setAnchor] = useState("");
    const [angle, setAngle] = useState(0);
    const [backfaceClip, setBackfaceClip] = useState("");
    const [frontfaceClip, setFrontfaceClip] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [cardRatio, setCardRatio] = useState(5 / 7);
    const centerSize = {horizontal: props.horizontalCenterSize || 40, vertical: props.verticalCenterSize || 60}

    useEffect(() => {
        const observer = new ResizeObserver(entries => entries.forEach(entry => setCardRatio(entry.contentRect.width / entry.contentRect.height)));
        containerRef.current && observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const onStart = (e: TouchEvent | MouseEvent) => {
        if (containerRef.current) {
            const startingPercentage = updateCursorPosition(e);
            const start = {...defaultStartingSides};
            if (startingPercentage.x < -centerSize.horizontal / 2) start.left = true;
            if (startingPercentage.x > centerSize.horizontal / 2) start.right = true;
            if (startingPercentage.y < -centerSize.vertical / 2) start.top = true;
            if (startingPercentage.y > centerSize.vertical / 2) start.bottom = true;
            if (Object.values(start).includes(true)) {
                setStartingSides(start);
                window.addEventListener('mousemove', updateCursorPosition);
                window.addEventListener('touchmove', updateCursorPosition);
            }
        }
    }
    const onEnd = () => {
        window.removeEventListener('mousemove', updateCursorPosition);
        window.removeEventListener('touchmove', updateCursorPosition);
        setStartingSides({...defaultStartingSides});
    }

    const updateCursorPosition = (e: TouchEvent | MouseEvent) => {
        e.preventDefault(); // prevent highlighting other elements
        // make center of card to {0, 0}
        const pokerRect = containerRef.current!.getBoundingClientRect();
        const containerCenter = {x: pokerRect.width / 2, y: pokerRect.height / 2};
        const client = 'touches' in e ? {x: e.touches[0].clientX, y: e.touches[0].clientY} : {x: e.clientX, y: e.clientY}
        const offset = {x: client.x - pokerRect.left - containerCenter.x, y: client.y - pokerRect.top - containerCenter.y};
        const percentage = {x: ((offset.x + containerCenter.x) / pokerRect.width) * 100, y: ((offset.y + containerCenter.y) / pokerRect.height) * 100};
        const cursor = { x: Math.max(Math.min(percentage.x - 50, 50), -50), y: Math.max(Math.min(percentage.y - 50, 50), -50) };
        setCursorPosition({...cursor});
        return {...cursor};
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.addEventListener('mousedown', onStart);
            containerRef.current.addEventListener('touchstart', onStart);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchend', onEnd);
            window.addEventListener('touchcancel', onEnd);
          }
      
          return () => {
            if (containerRef.current) {
              containerRef.current.removeEventListener('mousedown', onStart);
              containerRef.current.removeEventListener('touchstart', onStart);
              window.removeEventListener('mouseup', onEnd);
              window.removeEventListener('touchend', onEnd);
              window.removeEventListener('touchcancel', onEnd);
            }
            window.removeEventListener('mousemove', updateCursorPosition);
            window.removeEventListener('touchmove', updateCursorPosition);
        };
    }, []);

    // when calculation for x requires y, y needs to be normalized
    const normalizeY = (y: number) => {
        return y / cardRatio;
    }
    // when calculation for y requires x, x needs to be normalized
    const normalizeX = (x: number) => {
        return x * cardRatio;
    }

    const updateOffset = () => {
        const newOffset: typeof offset = {};
        if (startingSides.top) newOffset.bottom = `${50 - cursorPosition.y}%`;
        if (startingSides.bottom) newOffset.top = `${cursorPosition.y + 50}%`;
        if (startingSides.left) {
            if (startingSides.top || startingSides.bottom) newOffset.left = `${cursorPosition.x + 50}%`;
            else newOffset.right = `${50 - cursorPosition.x}%`;
        }
        if (startingSides.right) {
            if (startingSides.top || startingSides.bottom) newOffset.right = `${50 - cursorPosition.x}%`;
            else newOffset.left = `${50 + cursorPosition.x}%`;
        }
        if ((startingSides.left || startingSides.right) && !(startingSides.top || startingSides.bottom)) newOffset.top = "0%";
        setOffset({...newOffset});
    };

    const updateAnchor = () => {
        let newAnchor = new Set<"top" | "bottom" | "left" | "right">();
        if (startingSides.top) newAnchor.add("bottom");
        if (startingSides.bottom) newAnchor.add("top");
        if (startingSides.left) newAnchor.add("left");
        if (startingSides.right) newAnchor.add("right");
        setAnchor(Array.from(newAnchor).join(" "));
    }

    const updateAngle = () => {
        const startingCorner = { x: startingSides.left ? -50 : startingSides.right ? 50 : cursorPosition.x, y: startingSides.top ? -50 : startingSides.bottom ? 50 : cursorPosition.y };
        const deltaX = cursorPosition.x - startingCorner.x;
        const deltaY = cursorPosition.y - startingCorner.y;
        const slope = normalizeY(deltaY) / deltaX
        let angle = Math.atan(slope) * (180 / Math.PI) * 2 + 180 * Math.sign(-slope);
        angle = Math.max(Math.min(Math.abs(angle), 179.999), 0.001) * (angle >= 0 ? 1 : -1);
        setAngle(angle);
        return angle;
    };

    const changeClipPoints = (clipPoints: Array<string>, index: number, newPoints: Array<[x: number, y: number]>) => {
        clipPoints.splice(index, 1, ...newPoints.map(newPoint => `${newPoint[0]}% ${newPoint[1]}%`));
    }

    const updateBackfaceClip = (angle: number) => { 
        const clipPoints = ["0% 0%", "100% 0%", "100% 100%", "0% 100%"]; // top right, top left, bottom left, bottom right, because scale(-1);
        const [x, y] = [50 - cursorPosition.x, 50 + cursorPosition.y];
        const slope = Math.abs(angle) * Math.PI / 180;
        if (startingSides.top && startingSides.right) {
            const newX = x + normalizeY(y) / Math.tan(slope);
            const newY = (normalizeY(y) - x / Math.tan(slope)) * cardRatio; // * cardRatio to un-normalize Y
            changeClipPoints(clipPoints, 0, [[0, newY], [newX, 0]]);
        }
        else if (startingSides.top && startingSides.left) {
            const newX = x - normalizeY(y) / Math.tan(slope);
            const newY = (normalizeY(y) - (100 - x) / Math.tan(slope)) * cardRatio; // * cardRatio to un-normalize Y
            changeClipPoints(clipPoints, 1, [[newX, 0], [100, newY]]);
        }
        else if (startingSides.bottom && startingSides.left) {
            const newX = x - normalizeY(100 - y) / Math.tan(slope);
            const newY = (normalizeY(y) + (100 - x) / Math.tan(slope)) * cardRatio; // * cardRatio to un-normalize Y
            changeClipPoints(clipPoints, 2, [[100, newY], [newX, 100]]);
        }
        else if (startingSides.bottom && startingSides.right) {
            const newX = x + normalizeY(100 - y) / Math.tan(slope);
            const newY = (normalizeY(y) + x / Math.tan(slope)) * cardRatio; // * cardRatio to un-normalize Y
            changeClipPoints(clipPoints, 3, [[newX, 100], [0, newY]]);
        }
        else if (startingSides.right) {
            const newX = x / 2;
            changeClipPoints(clipPoints, 0, [[newX, 0]]);
            changeClipPoints(clipPoints, 3, [[newX, 100]]);
        }
        else if (startingSides.left) {
            const newX = 50 + x / 2;
            changeClipPoints(clipPoints, 1, [[newX, 0]]);
            changeClipPoints(clipPoints, 2, [[newX, 100]]);
        }
        else if (startingSides.top) {
            const newY = y / 2;
            changeClipPoints(clipPoints, 0, [[0, newY]]);
            changeClipPoints(clipPoints, 1, [[100, newY]]);
        }
        else if (startingSides.bottom) {
            const newY = 50 + y / 2;
            changeClipPoints(clipPoints, 2, [[100, newY]]);
            changeClipPoints(clipPoints, 3, [[0, newY]]);
        }
        setBackfaceClip(clipPoints.join());
    }

    const updateFrontfaceClip = (angle: number) => {
        const clipPoints = ["0% 0%", "100% 0%", "100% 100%", "0% 100%"]; // bottom right, bottom left, top left, top right;
        const [x, y] = [50 - cursorPosition.x, 50 + cursorPosition.y];
        const slope = Math.abs(angle) * Math.PI / 180;
        // must keep one adjacent point
        if (startingSides.top && startingSides.right) {
            // cursor point: 100, 100
            const newX = 100 - normalizeY(y) / Math.sin(slope);
            const newY = 100 - normalizeX(100 - newX) * Math.tan(slope / 2);
            changeClipPoints(clipPoints, 0, [[newX, 100]]); // y reference previous
            changeClipPoints(clipPoints, 1, [[100, newY]]); // x reference next

        }
        else if (startingSides.top && startingSides.left) {
            // cursor point is 0, 100
            const newX = normalizeY(y) / Math.sin(slope);
            const newY = 100 - normalizeX(newX) * Math.tan(slope / 2);
            changeClipPoints(clipPoints, 1, [[0, newY]]); // x reference previous
            changeClipPoints(clipPoints, 2, [[newX, 100]]); // y reference next
        }
        else if (startingSides.bottom && startingSides.left) {
            // cursor point is 0, 0
            const newX = normalizeY(100 - y) / Math.sin(slope);
            const newY = normalizeX(newX) * Math.tan(slope / 2);
            changeClipPoints(clipPoints, 2, [[newX, 0]]); // y reference previous
            changeClipPoints(clipPoints, 3, [[0, newY]]); // x reference next
        }
        else if (startingSides.bottom && startingSides.right) {
            // cursor point is 100, 0
            const newX = 100 - normalizeY(100 - y) / Math.sin(slope);
            const newY = normalizeX(100 - newX) * Math.tan(slope / 2);
            changeClipPoints(clipPoints, 3, [[100, newY]]); // x reference previous
            changeClipPoints(clipPoints, 0, [[newX, 0]]); // y reference next
        }
        else if (startingSides.left) {
            const newX = 50 + x / 2;
            changeClipPoints(clipPoints, 0, [[newX, 0]]);
            changeClipPoints(clipPoints, 3, [[newX, 100]]);
        }
        else if (startingSides.right) {
            const newX = x / 2;
            changeClipPoints(clipPoints, 1, [[newX, 0]]);
            changeClipPoints(clipPoints, 2, [[newX, 100]]);
        }
        else if (startingSides.top) {
            const newY = 100 - y / 2;
            changeClipPoints(clipPoints, 0, [[0, newY]]);
            changeClipPoints(clipPoints, 1, [[100, newY]])
        }
        else if (startingSides.bottom) {
            const newY = 50 - y / 2;
            changeClipPoints(clipPoints, 2, [[100, newY]]);
            changeClipPoints(clipPoints, 3, [[0, newY]])
        }
        setFrontfaceClip(clipPoints.join());
    }

    useEffect(() => {
        updateOffset();
        updateAnchor();
        const angle = updateAngle();
        updateBackfaceClip(angle);
        updateFrontfaceClip(angle);
    }, [startingSides, cursorPosition]);

    return (
        <div className="poker" ref={containerRef}>
            <div className="poker_backface" style={{"--clip": backfaceClip} as React.CSSProperties}/>
            { Object.values(startingSides).includes(true) && <div className={["poker_frontface", (startingSides.top || startingSides.bottom) ? "flip" : undefined].join(" ")} style={Object.assign({}, offset, {transformOrigin: anchor}, {"--angle": angle, "--clip": frontfaceClip})}><div /></div> }
        </div>
    )
}