import { useEffect, useRef, useState } from "react";
import "./Poker.css";

const defaultStartingSides = {left: false, top: false, right: false, bottom: false};
export const Poker = (props: {verticalCenterSize?: number, horizontalCenterSize?: number}) => {
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [startingSides, setStartingSides] = useState({...defaultStartingSides});
    const [offset, setOffset] = useState<{top?: string, bottom?: string, left?: string, right?: string}>({});
    const containerRef = useRef<HTMLDivElement>(null);

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

    const updateOffset = () => {
        const newOffset: typeof offset = {};
        if (startingSides.top) newOffset.bottom = `${50 - cursorPosition.y}%`;
        if (startingSides.bottom) newOffset.top = `${cursorPosition.y + 50}%`;
        if (startingSides.left) newOffset.left = `${cursorPosition.x + 50}%`;
        if (startingSides.right) newOffset.right = `${50 - cursorPosition.x}%`;
        setOffset({...newOffset});
    };

    useEffect(() => updateOffset(), [cursorPosition, startingSides]);

    const getFlip = () => {
        const flip = new Set();
        (startingSides.top || startingSides.bottom) && flip.add("flipY") && flip.add('flipX');
        return Array.from(flip).join(" ");
    }

    // useEffect(() => {
    //     console.log(getOffset());
    // }, [startingSides, cursorPosition])
    return (
        <div className="poker" ref={containerRef}>
            <table className="area_indicator" style={{ "--vertical_percentage": `${props.verticalCenterSize || 60}%`, "--horizontal_percentage": `${props.horizontalCenterSize || 40}%` } as React.CSSProperties}>
                <tbody>
                    <tr><td/><td/><td/></tr>
                    <tr><td/><td/><td/></tr>
                    <tr><td/><td/><td/></tr>
                </tbody>
            </table>
            <div className="poker_backface" />
            { Object.values(startingSides).includes(true) && <div className="test_point" style={{ "--x": `${cursorPosition.x + 50}%`, "--y": `${cursorPosition.y + 50}%` } as React.CSSProperties} />}
            <div className={["poker_frontface", (startingSides.top || startingSides.bottom) ? "flip" : undefined].join(" ")} style={{...offset}}/>
        </div>
    )
}