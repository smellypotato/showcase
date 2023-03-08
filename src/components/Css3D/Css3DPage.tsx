import { useCallback, useState } from "react";
import { Slider } from "../slider/slider";
import { Css3D } from "./Css3D";
import "./Css3DPage.css";
import { Css3DVisualize } from "./Css3DVisualize";

export const Css3DPage = () => {

    const [perspectiveRange, setPerspectiveRange] = useState({ min: 1, max: 500 });
    const [perspectiveOriginYRange, setPerspectiveOriginYRange] = useState({ min: -250, max: 250 });
    const [tableRotateRange, setTableRotateRange] = useState({ min: 0, max: 90 });
    const [tableZRange, setTableZRange] = useState({ min: -100, max: 100 });

    const [perspective, setPerspective] = useState(1);
    const [perspectiveOriginY, setPerspectiveOriginY] = useState(0);
    const [tableRotate, setTableRotate] = useState(0);
    const [tableZ, setTableZ] = useState(1);

    const onSlidePerspective = useCallback((percentage: number) => {
        setPerspective((perspectiveRange.max - perspectiveRange.min) * percentage + perspectiveRange.min);
    }, [perspectiveRange]);

    const onSlidePerspectiveOriginY = useCallback((percentage: number) => {
        setPerspectiveOriginY((perspectiveOriginYRange.max - perspectiveOriginYRange.min) * percentage + perspectiveOriginYRange.min);
    }, [perspectiveOriginYRange]);

    const onSlideTableRotate = useCallback((percentage: number) => {
        setTableRotate((tableRotateRange.max - tableRotateRange.min) * percentage + tableRotateRange.min);
    }, [tableRotateRange]);

    const onSlideTableZ = useCallback((percentage: number) => {
        setTableZ((tableZRange.max - tableZRange.min) * percentage + tableZRange.min);
    }, [tableZRange]);

    return (
        <div id="css-3d-page">
            <Css3D
                perspective={ perspective }
                perspectiveOriginY={ perspectiveOriginY }
                tableRotateX={ tableRotate }
                tableZ={ tableZ }
            />
            <Css3DVisualize
                perspective={ perspective }
                perspectiveOriginY={ perspectiveOriginY }
                tableRotateX={ tableRotate }
                tableZ={ tableZ }
            />
            <div>perspective</div>
            <div className="css-3d-page-slider" id="perspective-slider">
                { perspectiveRange.min }
                <Slider default={ 0 } sliderBarClass="css-3d-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ onSlidePerspective } />
                { perspectiveRange.max }
            </div>
            <div>perspective origin Y</div>
            <div className="css-3d-page-slider" id="perspective-origin-y-slider">
                { perspectiveOriginYRange.min }
                <Slider default={ 0.5 } sliderBarClass="css-3d-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ onSlidePerspectiveOriginY } />
                { perspectiveOriginYRange.max }
            </div>
            <div>table rotate</div>
            <div className="css-3d-page-slider" id="table-rotate-slider">
                { tableRotateRange.min }
                <Slider sliderBarClass="css-3d-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ onSlideTableRotate } />
                { tableRotateRange.max }
            </div>
            <div>table Z</div>
            <div className="css-3d-page-slider" id="table-z-slider">
                { tableZRange.min }
                <Slider default={ 0.5 } sliderBarClass="css-3d-page-slider-bar bg_grey_2" sliderFillClass="bg_sec_shade_2" sliderKnobClass="css-3d-page-slider-knob bg_sec_tint" onChangePercentage={ onSlideTableZ } />
                { tableZRange.max }
            </div>
        </div>
    )
}
