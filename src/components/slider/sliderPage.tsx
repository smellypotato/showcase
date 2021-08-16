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
                <Slider width={ 400 } onChangePercentage={ this.onChangePercentage.bind(this) } />
            </div>
        )
    }
}
