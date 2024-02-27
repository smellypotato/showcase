import { Poker } from "./Poker";
import "./PokerPage.css";

export const PokerPage = () => {
    return (
        <div id="poker_page">
            <div>Poker</div>
            <div id="poker_container"><Poker /></div>
        </div>
    )
}