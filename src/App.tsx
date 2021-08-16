import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ColorPickerPage } from './components/colorPicker/colorPickerPage';
import { Home } from './components/home/home';
import { SliderPage } from './components/slider/sliderPage';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/color-picker"><ColorPickerPage /></Route>
                        <Route exact path="/slider"><SliderPage /></Route>
                        <Route path="/"><Home /></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
