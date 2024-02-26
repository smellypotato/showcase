import "./ProgressPage.css";
import { useState } from "react";
import { Slider } from "../slider/slider"
import { ModernProgress, Progress } from "./Progress";

export const ProgressPage = () => {

    const [percentage, setPercentage] = useState(0);

    const onChangePercentage = (percentage: number) => {
        setPercentage(Math.round(percentage * 100));
    }

    return (
        <div id="progress_page">
            <input type="number" value={percentage} min={0} max={100} onChange={(e) => setPercentage(Math.min(100, Math.max(0, parseInt(e.currentTarget.value))))}/>
            <div>More likely to support older browsers</div>
            <div className="progress_demo"><Progress percentage={percentage} thickness={4} /></div>
            <br />
            <div>More like to support newer browsers with support of @property</div>
            <div className="progress_demo"><ModernProgress percentage={percentage} thickness={4} /></div>
            <Slider default={ 0 } sliderBarClass="css-3d-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ onChangePercentage } />
        </div>
    )
}