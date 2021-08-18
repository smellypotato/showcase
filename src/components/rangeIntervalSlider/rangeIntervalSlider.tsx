import { useEffect, useRef, useState } from "react";
import "./rangeIntervalSlider.css";

export const RangeIntervalSlider = (props: { barColor: string, fillColor: string, barClass: string, minKnobClass: string, maxKnobClass: string, stopOnOverlap: boolean, onChangeMin: Function, onChangeMax: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let knobRef: [React.RefObject<HTMLDivElement>, React.RefObject<HTMLDivElement>] = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
    let [minKnobPos, setminKnobPos] = useState(0);
    let [maxKnobPos, setmaxKnobPos] = useState(1);
    let [activeKnob, setActiveKnob] = useState(-1); // for setting z-Index
    let movingKnob = -1; //no need state, will reset anyway

    useEffect(() => props.onChangeMin(minKnobPos), [minKnobPos]);
    useEffect(() => props.onChangeMax(maxKnobPos), [maxKnobPos]);

    let float2Decimal = (value: number, decimal: number) => parseFloat(value.toFixed(decimal));

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        let newPos = (x - rect.left) / rect.width;
        let otherKnob = (movingKnob + 1) % 2;
        let otherKnobRect = knobRef[otherKnob].current!.getBoundingClientRect();
        let setKnobPos: React.Dispatch<React.SetStateAction<number>> = movingKnob === 0 ? setminKnobPos : setmaxKnobPos;
        if ((movingKnob === 0 && x > otherKnobRect.left) || (movingKnob === 1 && x < otherKnobRect.left)) {
            let otherKnobPos = (otherKnobRect.left - rect.left) / rect.width;
            setKnobPos(float2Decimal(otherKnobPos, 4)); // set current knob position to exact same as other knob first
            if (props.stopOnOverlap) return;
            movingKnob = otherKnob; // change current knob to other knob
            setActiveKnob(otherKnob);
            setKnobPos = movingKnob === 0 ? setminKnobPos : setmaxKnobPos;
        }
        setKnobPos(float2Decimal(newPos, 4));
    }

    let onDown = (pos: [number, number], changeKnobPos: Function) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let sliderPos = (pos[0] - rect.left) / rect.width;
        movingKnob = sliderPos < minKnobPos || Math.abs(sliderPos - minKnobPos) < Math.abs(sliderPos - maxKnobPos) ? 0 : 1;
        setActiveKnob(movingKnob);
        changeKnobPos(pos);
        let move = (e: PointerEvent) => changeKnobPos([e.clientX, e.clientY]);
        let up = () => {
            movingKnob = -1;
            setActiveKnob(-1);
            document.body.removeEventListener("pointermove", move);
            document.body.removeEventListener("pointerup", up);
        }
        document.body.addEventListener("pointermove", move);
        document.body.addEventListener("pointerup", up);
    }

    return (
        <div ref={ sliderRef } className="range-interval-slider no_highlight"
            onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeKnobPos) }>
            <div className={ `range-interval-slider-bar ${props.barClass}` }
                style={ {
                    background: `linear-gradient(to right,
                        ${props.barColor} ${minKnobPos * 100}%,
                        ${props.fillColor} ${minKnobPos * 100}%,
                        ${props.fillColor} ${maxKnobPos * 100}%,
                        ${props.barColor} ${maxKnobPos * 100}%,
                        ${props.barColor})`
                } }
            />
            <div ref={ knobRef[0] } className="range-interval-slider-position" style={ { left: `${minKnobPos * 100}%`, zIndex: activeKnob === 0 ? 1 : 0 } }>
                <div className={ `range-interval-slider-knob ${props.minKnobClass}` } />
            </div>
            <div ref={ knobRef[1] } className="range-interval-slider-position" style={ { left: `${maxKnobPos * 100}%`, zIndex: activeKnob === 1 ? 1 : 0 } }>
                <div className={ `range-interval-slider-knob ${props.maxKnobClass}` } />
            </div>
        </div>
    )
}
