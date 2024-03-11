import { useCallback, useState } from "react";
import { PokerFlipper } from "./PokerFlipper";
import "./PokerPage.css";
import { Poker } from "./Poker";

export const PokerPage = () => {
    const [orientation, setOrientation] = useState(1);

    const onRotate = useCallback(() => {
        setOrientation(-orientation);
    }, [orientation]);

    return (
        <div id="poker_page">
            <div>Poker</div>
            <div id="poker_container" className={orientation === 1 ? "vertical" : "horizontal"}>
                <PokerFlipper rotated={orientation === -1} horizontalCenterSize={50} verticalCenterSize={60} onRotate={() => { onRotate()}}>
                    <Poker rotated={orientation === -1} cardValue={112}/>
                </PokerFlipper>
            </div>
        </div>
    )
}