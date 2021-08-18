import React from "react";
import { RangeIntervalSlider } from "./rangeIntervalSlider";

import "./rangeIntervalSliderPage.css";

export class RangeIntervalSliderPage extends React.Component<{}, { min: number, max: number }> {
    state = {
        min: 0,
        max: 1,
    }

    onChangeMin(number: number) {
        this.setState({ min: number });
    }
    onChangeMax(number: number) {
        this.setState({ max: number });
    }

    render() {
        return (
            <div id="range-interval-slider-page">
                <div className="f_24">Range Interval Slider</div>
                <div className="f_16">{ this.state.min } - { this.state.max }</div>
                <div id="range-interval-slider-page-slider">
                    <RangeIntervalSlider
                        barColor="#C1C9CD"
                        fillColor="#927DA4"
                        barClass="range-interval-slider-page-slider-bar"
                        minKnobClass="range-interval-slider-page-slider-knob bg_red"
                        maxKnobClass="range-interval-slider-page-slider-knob bg_blue"
                        stopOnOverlap={ true }
                        onChangeMin={ this.onChangeMin.bind(this) }
                        onChangeMax={ this.onChangeMax.bind(this) }
                    />
                </div>
                <div>knob height follows slider height; slider bar height independent</div>
                <div>color style separated from class</div>
            </div>
        )
    }
}
