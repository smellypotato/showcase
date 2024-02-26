import { useEffect, useRef, useState } from "react";
import "./intervalSlider.css";

export const IntervalSlider = (props: { intervals: number , sliderBarClass: string, sliderFillClass: string, sliderKnobClass: string, onChangePercentage: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let [sliderPos, setSliderPos] = useState(0);

    useEffect(() => {
        let closest = Math.round(sliderPos * props.intervals);
        props.onChangePercentage(closest)
    }, [sliderPos]);

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        let closest = Math.round((x - rect.left) / rect.width * props.intervals);
        setSliderPos(closest / props.intervals);
    }

    let onDown = (pos: [number, number], changeKnobPos: Function) => {
        changeKnobPos(pos);
        let move = (e: PointerEvent) => changeKnobPos([e.clientX, e.clientY]);
        let up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        }
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    }

    return (
        <div ref={ sliderRef } className="interval-slider no_highlight"
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className={ `interval-slider-bar ${props.sliderBarClass}` }><div className={ `interval-slider-fill ${props.sliderFillClass}` } style={ { width: `${sliderPos * 100}%` } } /></div>
            <div className="interval-slider-position" style={ { left: `${sliderPos * 100}%` } }>
                <div className={ `interval-slider-knob ${props.sliderKnobClass}` } />
            </div>
        </div>
    )
}
