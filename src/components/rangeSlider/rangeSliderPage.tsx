import React from "react";
import { RangeSlider } from "./rangeSlider";

import "./rangeSliderPage.css";

export class RangeSliderPage extends React.Component<{}, { minPercentage: number, maxPercentage: number }> {
    state = {
        minPercentage: 0,
        maxPercentage: 1
    }

    onChangeMinPercentage(percentage: number) {
        this.setState({ minPercentage: percentage });
    }
    onChangeMaxPercentage(percentage: number) {
        this.setState({ maxPercentage: percentage });
    }

    render() {
        return (
            <div id="range-slider-page">
                <div className="f_24">Range Slider</div>
                <div className="f_16">{ this.state.minPercentage } - { this.state.maxPercentage }</div>
                <div id="range-slider-page-slider">
                    <RangeSlider
                        barColor="#C1C9CD"
                        fillColor="#927DA4"
                        barClass="range-slider-page-slider-bar"
                        minKnobClass="range-slider-page-slider-knob bg_red"
                        maxKnobClass="range-slider-page-slider-knob bg_blue"
                        stopOnOverlap={ true }
                        onChangeMinPercentage={ this.onChangeMinPercentage.bind(this) }
                        onChangeMaxPercentage={ this.onChangeMaxPercentage.bind(this) }
                    />
                </div>
                <div>knob height follows slider height; slider bar height independent</div>
                <div>color style separated from class</div>
            </div>
        )
    }
}
