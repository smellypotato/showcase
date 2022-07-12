import { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

export const Home = (props: {  }) => {
    const [showList, setShowList] = useState(false);
    return (
        <div id="home">
            <div className="f_32 l_40 text_center">Welcome to the POTATO SHOWCASE!</div>
            <div id="home-choice">
                <div id={ `home-choice-selected${showList ? "-opened" : ""}` } className="text_center cursor_button" onClick={ () => setShowList(!showList) }>Select demo</div>
                <ul style={ { visibility: !showList ? "hidden" : "visible" } }>
                    <Link to="/color-picker"><li className="cursor_button">Color Picker</li></Link>
                    <Link to="/slider"><li className="cursor_button">Slider</li></Link>
                    <Link to="/interval-slider"><li className="cursor_button">Interval Slider</li></Link>
                    <Link to="/range-slider"><li className="cursor_button">Range Slider</li></Link>
                    <Link to="/range-interval-slider"><li className="cursor_button">Range Interval Slider</li></Link>
                    <Link to="/calendar"><li className="cursor_button">Calendar</li></Link>
                    <Link to="/yahtzee"><li className="cursor_button">Yahtzee</li></Link>
                    <Link to="/snake"><li className="cursor_button">Snake</li></Link>
                    <Link to="/timer"><li className="cursor_button">Accurate Timer</li></Link>
                    <Link to="/a-star"><li className="cursor_button">A* Algorithm</li></Link>

                </ul>
            </div>
        </div>
    )
}
