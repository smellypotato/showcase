import { useEffect, useRef, useState } from "react";
import "./Poker.css";

export const Poker = () => {
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const containerRef = useRef<HTMLDivElement>(null);

    const onStart = () => {
        if (containerRef.current) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('touchmove', onMove);
        }
    }
    const onEnd = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
    }
    const onMove = (e: TouchEvent | MouseEvent) => {
        // make center of card to {0, 0}
        const pokerRect = containerRef.current!.getBoundingClientRect();
        const containerCenter = {x: pokerRect.width / 2, y: pokerRect.height / 2};
        const client = 'touches' in e ? {x: e.touches[0].clientX, y: e.touches[0].clientY} : {x: e.clientX, y: e.clientY}
        const offset = {x: client.x - pokerRect.left - containerCenter.x, y: client.y - pokerRect.top - containerCenter.y};
        const percentage = {x: ((offset.x + containerCenter.x) / pokerRect.width) * 100, y: ((offset.y + containerCenter.y) / pokerRect.height) * 100};
        setCursorPosition({ x: Math.max(Math.min(percentage.x - 50, 50), -50), y: Math.max(Math.min(percentage.y - 50, 50), -50) });
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
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
          };
      }, []);

    return (
        <div className="poker" ref={containerRef}>
            <div className="poker_backface" />
            <div className="test_point" style={{ "--x": `${cursorPosition.x + 50}%`, "--y": `${cursorPosition.y + 50}%` } as React.CSSProperties} />
        </div>
    )
}