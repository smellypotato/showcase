import { useEffect, useRef, useState } from "react";
import "./slider.css";

export const Slider = (props: { sliderBarClass: string, sliderFillClass: string, sliderKnobClass: string, onChangePercentage: Function, default?: number }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let [sliderPos, setSliderPos] = useState(props.default || 0);

    useEffect(() => props.onChangePercentage(sliderPos), [sliderPos]);

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        setSliderPos((x - rect.left) / rect.width);
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
        <div ref={ sliderRef } className="slider no_highlight"
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className={ `slider-bar ${props.sliderBarClass}` }><div className={ `slider-fill ${props.sliderFillClass}` } style={ { width: `${sliderPos * 100}%` } } /></div>
            <div className="slider-position" style={ { left: `${sliderPos * 100}%` } }>
                <div className={ `silder-knob ${props.sliderKnobClass}` } />
            </div>
        </div>
    )
}
