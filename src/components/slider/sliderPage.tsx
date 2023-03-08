import React from "react";
import { Slider } from "./slider";

import "./sliderPage.css";

export class SliderPage extends React.Component<{}, { percentage: number }> {
    state = {
        percentage: 0
    }

    onChangePercentage(percentage: number) {
        this.setState({ percentage: percentage});
    }

    render() {
        return (
            <div id="slider-page">
                <div className="f_24">Slider</div>
                <div className="f_16">{ this.state.percentage }</div>
                <div id="slider-page-slider">
                    <Slider sliderBarClass="slider-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ this.onChangePercentage.bind(this) } />
                </div>
                <div>
                    knob height follows slider height; slider bar height independent
                </div>
            </div>
        )
    }
}
