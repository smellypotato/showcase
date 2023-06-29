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
                    <Link to="/showcase/color-picker"><li className="cursor_button">Color Picker</li></Link>
                    <Link to="/showcase/slider"><li className="cursor_button">Slider</li></Link>
                    <Link to="/showcase/interval-slider"><li className="cursor_button">Interval Slider</li></Link>
                    <Link to="/showcase/range-slider"><li className="cursor_button">Range Slider</li></Link>
                    <Link to="/showcase/range-interval-slider"><li className="cursor_button">Range Interval Slider</li></Link>
                    <Link to="/showcase/calendar"><li className="cursor_button">Calendar</li></Link>
                    <Link to="/showcase/yahtzee"><li className="cursor_button">Yahtzee</li></Link>
                    <Link to="/showcase/snake"><li className="cursor_button">Snake</li></Link>
                    <Link to="/showcase/timer"><li className="cursor_button">Accurate Timer</li></Link>
                    <Link to="/showcase/a-star"><li className="cursor_button">A* Algorithm</li></Link>
                    <Link to="/showcase/3d-css"><li className="cursor_button">3D CSS</li></Link>
                    <Link to="/showcase/use-columns"><li className="cursor_button">useColumns</li></Link>
                </ul>
            </div>
        </div>
    )
}
