import React from "react";
import { ColorPicker, RGB } from "./colorPicker";
import "./colorPickerPage.css";

export class ColorPickerPage extends React.Component<{}, { backgroundColor: string }> {
    state = {
        backgroundColor: "rgb(255, 255, 255)"
    }

    onChangeColor(color: RGB) {
        this.setState({ backgroundColor: `rgb(${color.R}, ${color.G}, ${color.B})`});
    }

    render() {
        return (
            <div id="color-picker-page" style={ { backgroundColor: `${this.state.backgroundColor}`} }>
                <div className="f_24">Color Picker</div>
                <div className="f_16">{ this.state.backgroundColor}</div>
                <ColorPicker size={ 500 } onChangeColor={ this.onChangeColor.bind(this) }/>
            </div>
        )
    }
}
