import React from "react";
import { IntervalSlider } from "./intervalSlider";

import "./intervalSliderPage.css";

export class IntervalSliderPage extends React.Component<{}, { number: number }> {
    state = {
        number: 0
    }

    onChangeNumber(number: number) {
        this.setState({ number: number });
    }

    render() {
        return (
            <div id="interval-slider-page">
                <div className="f_24">Interval Slider</div>
                <div className="f_16">{ this.state.number }</div>
                <div id="interval-slider-page-slider">
                    <IntervalSlider intervals={ 15 } sliderBarClass="interval-slider-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="interval-slider-page-slider-knob bg_sec_tint" onChangePercentage={ this.onChangeNumber.bind(this) } />
                </div>
                <div>
                    knob height follows slider height; slider bar height independent
                </div>
            </div>
        )
    }
}
