import { useEffect, useRef, useState } from "react";
import "./rangeSlider.css";

export const RangeSlider = (props: { sliderBarClass: string, sliderFillClass: string, sliderKnobClass: string, onChangeMinPercentage: Function, onChangeMaxPercentage: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let [minSliderPos, setMinSliderPos] = useState(0);
    let [maxSliderPos, setMaxSliderPos] = useState(1);
    let movingKnob = -1; //no need state, will reset anyway

    useEffect(() => {
        props.onChangeMinPercentage(minSliderPos);
        props.onChangeMaxPercentage(maxSliderPos);
    }, [minSliderPos, maxSliderPos]);

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        let newPos = (x - rect.left) / rect.width;
        switch (movingKnob) {
            case 0 :
                setMinSliderPos(newPos);
            break;
            case 1:
                setMaxSliderPos(newPos);
            break;
        }

    }

    let onDown = (pos: [number, number], changeKnobPos: Function) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        movingKnob = Math.abs((pos[0] - rect.left) / rect.width - minSliderPos) <= Math.abs((pos[0] - rect.left) / rect.width - maxSliderPos) ? 0 : 1;
        changeKnobPos(pos);
        let move = (e: PointerEvent) => changeKnobPos([e.clientX, e.clientY]);
        let up = () => {
            movingKnob = -1;
            document.body.removeEventListener("pointermove", move);
            document.body.removeEventListener("pointerup", up);
        }
        document.body.addEventListener("pointermove", move);
        document.body.addEventListener("pointerup", up);
    }

    return (
        <div ref={ sliderRef } className="range-slider no_highlight"
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className={ `range-slider-fill ${props.sliderBarClass}` }>
                <div className={ `range-slider-bar ${props.sliderFillClass}` } style={ { width: `${minSliderPos * 100}%` } } />
                <div className={ `range-slider-bar ${props.sliderFillClass}` } style={ { width: `${(1 - maxSliderPos) * 100}%` } } />
            </div>
            <div className="range-slider-position" style={ { left: `${minSliderPos * 100}%` } }>
                <div className={ `range-silder-knob ${props.sliderKnobClass}` } />
            </div>
            <div className="range-slider-position" style={ { left: `${maxSliderPos * 100}%` } }>
                <div className={ `range-silder-knob ${props.sliderKnobClass}` } />
            </div>
        </div>
    )
}
