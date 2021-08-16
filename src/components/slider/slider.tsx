import { useEffect, useRef, useState } from "react";
import "./slider.css";

export const Slider = (props: { size: { width: number, height: number }, onChangePercentage: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let [sliderPos, setSliderPos] = useState(0);

    useEffect(() => props.onChangePercentage(sliderPos), [sliderPos]);

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        setSliderPos((x - rect.left) / props.size.width);
    }

    let onDown = (pos: [number, number], changeKnobPos: Function) => {
        changeKnobPos(pos);
        let move = (e: PointerEvent) => changeKnobPos([e.clientX, e.clientY]);
        let up = () => {
            document.body.removeEventListener("pointermove", move);
            document.body.removeEventListener("pointerup", up);
        }
        document.body.addEventListener("pointermove", move);
        document.body.addEventListener("pointerup", up);
    }

    return (
        <div ref={ sliderRef } className="slider no_highlight" style={ { width: props.size.width, height: props.size.height } }
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className="slider-bar bg_grey_1" />
            <div className="slider-position" style={ { left: `${sliderPos * 100}%` } }>
                <div className="silder-knob bg_sec_tint" />
            </div>
        </div>
    )
}
