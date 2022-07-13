import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AStarPage } from './components/aStar/aStarPage';
import { CalendarPage } from './components/calendar/calendarPage';
import { ColorPickerPage } from './components/colorPicker/colorPickerPage';
import { Home } from './components/home/home';
import { IntervalSliderPage } from './components/intervalSlider/intervalSliderPage';
import { RangeIntervalSliderPage } from './components/rangeIntervalSlider/rangeIntervalSliderPage';
import { RangeSliderPage } from './components/rangeSlider/rangeSliderPage';
import { SliderPage } from './components/slider/sliderPage';
import { SnakePage } from './components/snake/snakePage';
import { TimerPage } from './components/timer/timerPage';
import { YahtzeePage } from './components/yahtzee/yahtzeePage';

export const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="App">
            { location.key !== "default" && <div id="back" className="cursor_button" onClick={ () => navigate(-1) }>Back</div> }
            <Routes>
                <Route path="/color-picker" element={ <ColorPickerPage /> } />
                <Route path="/slider" element={ <SliderPage /> } />
                <Route path="/interval-slider" element={ <IntervalSliderPage /> } />
                <Route path="/range-slider" element={ <RangeSliderPage /> } />
                <Route path="/range-interval-slider" element={ <RangeIntervalSliderPage /> } />
                <Route path="/calendar" element={ <CalendarPage /> } />
                <Route path="/yahtzee" element={ <YahtzeePage /> } />
                <Route path="/snake" element={ <SnakePage /> } />
                <Route path="/timer" element={ <TimerPage /> } />
                <Route path="/a-star" element={ <AStarPage /> } />
                <Route path="/" element={ <Home /> } />
            </Routes>
        </div>
    )
}
