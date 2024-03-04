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
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRatio = 5 / 7;
    const centerSize = {horizontal: props.horizontalCenterSize || 40, vertical: props.verticalCenterSize || 60}

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

    // when calculation requires x and y, y needs to be normalized
    const normalizeY = (y: number) => {
        return y / cardRatio;
    }

    const updateOffset = () => {
        const newOffset: typeof offset = {};
        if (startingSides.top) newOffset.bottom = `${50 - cursorPosition.y}%`;
        if (startingSides.bottom) newOffset.top = `${cursorPosition.y + 50}%`;
        if (startingSides.left) newOffset.left = `${cursorPosition.x + 50}%`;
        if (startingSides.right) newOffset.right = `${50 - cursorPosition.x}%`;
        setOffset({...newOffset});
    };

    const updateAnchor = () => {
        let newAnchor = new Set();
        if (startingSides.top) newAnchor.add("bottom");
        if (startingSides.bottom) newAnchor.add("top");
        if (startingSides.left) newAnchor.add("left");
        if (startingSides.right) newAnchor.add("right");
        setAnchor(Array.from(newAnchor).join(" "));
    }

    const updateAngle = () => {
        const startingCorner = { x: startingSides.left ? -50 : 50, y: startingSides.top ? -50 : 50 };
        const deltaX = cursorPosition.x - startingCorner.x;
        const deltaY = cursorPosition.y - startingCorner.y;
        const slope = normalizeY(deltaY) / deltaX
        const angle = Math.atan(slope) * (180 / Math.PI) * 2 + 180;
        setAngle(angle);
        return angle;
    };

    const updateBackfaceClip = (angle: number) => {
        const clipPoints = ["0% 0%", "100% 0%", "100% 100%", "0% 100%"]; // top right, top left, bottom left, bottom right, because scale(-1);
        const [x, y] = [50 - cursorPosition.x, 50 + cursorPosition.y];
        if (startingSides.top && startingSides.right) {

            const newX = (x + normalizeY(y) * Math.tan((90 - angle) * Math.PI / 180));
            const newY = (normalizeY(y) - x * Math.tan((90 - angle) * Math.PI / 180)) * cardRatio; // * cardRatio to un-normalize Y
            clipPoints.splice(0, 1, `0% ${newY}%`, `${newX}% 0%`);
        }
        else if (startingSides.top && startingSides.left) {
            const newX = (x + normalizeY(y) * Math.tan((90 - angle) * Math.PI / 180));
            const newY = (normalizeY(y) - (x) * Math.tan((90 - angle) * Math.PI / 180)) * cardRatio; // * cardRatio to un-normalize Y
            clipPoints.splice(1, 1, `${newX}% 0%`, `100% ${newY}%`);
        }
        else if (startingSides.bottom && startingSides.left) {
            const newX = (x + normalizeY(y) * Math.tan((90 - angle) * Math.PI / 180));
            const newY = (normalizeY(y) - x * Math.tan((90 - angle) * Math.PI / 180)) * cardRatio; // * cardRatio to un-normalize Y
            clipPoints.splice(2, 1, `100% ${newY}%`, `${newX}% 100%`);
        }
        else if (startingSides.bottom && startingSides.right) {
            const newX = (x + normalizeY(y) * Math.tan((90 - angle) * Math.PI / 180));
            const newY = (normalizeY(y) - x * Math.tan((90 - angle) * Math.PI / 180)) * cardRatio; // * cardRatio to un-normalize Y
            clipPoints.splice(3, 1, `${newX}% 100%`, `0% ${newY}%`);
        }
        setBackfaceClip(clipPoints.join());
    }

    useEffect(() => {
        updateOffset();
        updateAnchor();
        const angle = updateAngle();
        updateBackfaceClip(angle);
    }, [startingSides, cursorPosition]);

    return (
        <div className="poker" ref={containerRef}>
            <table className="area_indicator" style={{ "--vertical_percentage": `${props.verticalCenterSize || 60}%`, "--horizontal_percentage": `${props.horizontalCenterSize || 40}%` } as React.CSSProperties}>
                <tbody>
                    <tr><td/><td/><td/></tr>
                    <tr><td/><td/><td/></tr>
                    <tr><td/><td/><td/></tr>
                </tbody>
            </table>
            <div className="poker_backface" style={{"--clip": backfaceClip} as React.CSSProperties}/>
            { Object.values(startingSides).includes(true) && <div className="test_point" style={{ "--x": `${cursorPosition.x + 50}%`, "--y": `${cursorPosition.y + 50}%` } as React.CSSProperties} /> }
            { Object.values(startingSides).includes(true) && <div className={["poker_frontface", (startingSides.top || startingSides.bottom) ? "flip" : undefined].join(" ")} style={Object.assign({}, offset, {transformOrigin: anchor}, {"--angle": angle})}><div /></div> }
        </div>
    )
}