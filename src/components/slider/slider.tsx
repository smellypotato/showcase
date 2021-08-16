import { useEffect, useRef, useState } from "react";
import "./slider.css";

export const Slider = (props: { width: number, onChangePercentage: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let [sliderPos, setSliderPos] = useState(0);

    useEffect(() => props.onChangePercentage(sliderPos / props.width), [sliderPos]);

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        setSliderPos(x - rect.left);
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
        <div ref={ sliderRef } className="slider" style={ { width: props.width } }
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className="slider-bar">
            </div>
        </div>
    )
}
