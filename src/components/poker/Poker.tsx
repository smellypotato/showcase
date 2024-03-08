import { useCallback, useEffect, useRef, useState } from "react";
import "./Poker.css";

const POINTS = [
    [13],
    [11, 15],
    [11, 13, 15],
    [1, 2, 9, 10],
    [1, 2, 9, 10, 13],
    [1, 2, 5, 6, 9, 10],
    [1, 2, 5, 6, 9, 10, 12],
    [1, 2, 5, 6, 9, 10, 12, 14],
    [1, 2, 3, 4, 7, 8, 9, 10, 13],
    [1, 2, 3, 4, 7, 8, 9, 10, 12, 14],
]
const INVERSE = [7, 8, 9, 10, 14, 15];

export const Poker = (props: {cardValue: number}) => {
    const pokerRef = useRef<HTMLElement>(null);
    const [borderRadius, setBorderRadius] = useState(0);

    useEffect(() => {
        const observer = new ResizeObserver(entries => entries.forEach(entry => setBorderRadius(Math.max(entry.contentRect.width, entry.contentRect.height) / 10 / 2)));
        // corner radius is typically around 1/8 to 1/10 of the width or height of the card;
        pokerRef.current && observer.observe(pokerRef.current);
        return () => observer.disconnect();
    }, []);

    const suit = useCallback((cardValue: number) => {
        return Math.floor(cardValue / 100) * 100;
    }, [])

    const suitDisplayClass = useCallback((index: number) => {
        const className = ["suit", `svg_poker_${suit(props.cardValue)}`, `p_${index}`];
        INVERSE.includes(index) && className.push("inverse");
        return className.join(" ");
    }, [props.cardValue]);

    return (
        <article className={`poker ${Math.floor(props.cardValue / 100) % 2 === 1 ? "black" : "red"}`} style={{ "--corner": `${borderRadius}px`} as React.CSSProperties}ref={pokerRef}>
            <div className="corner">
                <div className={`rank svg_poker_${props.cardValue % 100}`} />
                <div className={`suit svg_poker_${suit(props.cardValue)}`} />
            </div>
            <div className="suit_display">
                {POINTS[props.cardValue % 100 - 1].map(p => <div className={suitDisplayClass(p)}/>)}
            </div>
            <div className="corner inverse">
                <div className={`rank svg_poker_${props.cardValue % 100}`} />
                <div className={`suit svg_poker_${suit(props.cardValue)}`} />
            </div>
        </article>
    )
}