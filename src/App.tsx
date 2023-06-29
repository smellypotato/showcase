import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Css3DPage } from './components/Css3D/Css3DPage';
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
import { UseColumnsPage } from './components/useColumns/useColumnsPage';

export const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="App">
            { location.pathname !== "/showcase" && <div id="back" className="cursor_button" onClick={ () => location.key !== "default" ? navigate(-1) : navigate( "/showcase", { replace: true }) }>Back</div> }
            <Routes>
                <Route path="/showcase/color-picker" element={ <ColorPickerPage /> } />
                <Route path="/showcase/slider" element={ <SliderPage /> } />
                <Route path="/showcase/interval-slider" element={ <IntervalSliderPage /> } />
                <Route path="/showcase/range-slider" element={ <RangeSliderPage /> } />
                <Route path="/showcase/range-interval-slider" element={ <RangeIntervalSliderPage /> } />
                <Route path="/showcase/calendar" element={ <CalendarPage /> } />
                <Route path="/showcase/yahtzee" element={ <YahtzeePage /> } />
                <Route path="/showcase/snake" element={ <SnakePage /> } />
                <Route path="/showcase/timer" element={ <TimerPage /> } />
                <Route path="/showcase/a-star" element={ <AStarPage /> } />
                <Route path="/showcase/3d-css" element={ <Css3DPage /> } />
                <Route path="/showcase/use-columns" element={ <UseColumnsPage /> } />
                <Route path="/showcase/*" element={ <Home /> } />
            </Routes>
        </div>
    )
}
