import { useEffect, useState } from "react";

export const useColumns = (containerRef: React.RefObject<HTMLElement>, minWidth: number, gap: number = 0, minColumns: number = 2) => {
    const [width, setWidth] = useState(0);
    const [maxDisplay, setMaxDisplay] = useState(0);

    useEffect(() => { // init container width when containerRef exists
        containerRef.current && setWidth(containerRef.current.clientWidth);
    }, [containerRef.current]);

    useEffect(() => { // update width when container width changes
        const observer = new ResizeObserver(entries => entries.forEach(entry => setWidth(entry.contentRect.width)));
        containerRef.current && observer.observe(containerRef.current);
        return () => observer.disconnect()
    }, []);

    useEffect(() => { // update max display when width changes
        if (width > 0) { // wait for width stabled
            let max = Math.floor(width / (minWidth + gap));
            if (minColumns) max = Math.max(minColumns, max);
            setMaxDisplay(max);
        }
    }, [width, minColumns]);

    return maxDisplay;
}
