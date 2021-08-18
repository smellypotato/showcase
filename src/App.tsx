import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ColorPickerPage } from './components/colorPicker/colorPickerPage';
import { Home } from './components/home/home';
import { IntervalSliderPage } from './components/intervalSlider/intervalSliderPage';
import { RangeIntervalSliderPage } from './components/rangeIntervalSlider/rangeIntervalSliderPage';
import { RangeSliderPage } from './components/rangeSlider/rangeSliderPage';
import { SliderPage } from './components/slider/sliderPage';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/color-picker"><ColorPickerPage /></Route>
                        <Route exact path="/slider"><SliderPage /></Route>
                        <Route exact path="/interval-slider"><IntervalSliderPage /></Route>
                        <Route exact path="/range-slider"><RangeSliderPage /></Route>
                        <Route exact path="/range-interval-slider"><RangeIntervalSliderPage /></Route>
                        <Route path="/"><Home /></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
