import { useCallback, useState } from "react";
import { PokerFlipper } from "./PokerFlipper";
import "./PokerPage.css";

export const PokerPage = () => {
    const [orientation, setOrientation] = useState(1);

    const onRotate = useCallback(() => {
        setOrientation(-orientation);
    }, [orientation]);

    return (
        <div id="poker_page">
            <div>Poker</div>
            <div id="poker_container" className={orientation === 1 ? "vertical" : "horizontal"}><PokerFlipper cardValue={409} horizontalCenterSize={30} verticalCenterSize={40} onRotate={() => { onRotate()}} /></div>
        </div>
    )
}