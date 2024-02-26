import { useEffect, useRef, useState } from "react";
import "./rangeIntervalSlider.css";

export const RangeIntervalSlider = (props: { intervals: number, barColor: string, fillColor: string, barClass: string, minKnobClass: string, maxKnobClass: string, allowOverlap: boolean, stopOnOverlap: boolean, onChangeMin: Function, onChangeMax: Function }) => {
    let sliderRef = useRef<HTMLDivElement>(null);
    let knobRef: [React.RefObject<HTMLDivElement>, React.RefObject<HTMLDivElement>] = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
    let [minKnobPos, setminKnobPos] = useState(0);
    let [maxKnobPos, setmaxKnobPos] = useState(1);
    let [activeKnob, setActiveKnob] = useState(-1); // for setting z-Index
    let movingKnob = useRef(-1); //no need state, will reset anyway

    useEffect(() => props.onChangeMin(Math.round(minKnobPos * props.intervals)), [minKnobPos]);
    useEffect(() => props.onChangeMax(Math.round(maxKnobPos * props.intervals)), [maxKnobPos]);

    let float2Decimal = (value: number, decimal: number) => parseFloat(value.toFixed(decimal));

    let changeKnobPos = (pointerPos: [number, number]) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        let newPos = (x - rect.left) / rect.width;
        let closest = Math.round(newPos * props.intervals) / props.intervals;
        let otherKnob = (movingKnob.current + 1) % 2;
        let otherKnobRect = knobRef[otherKnob].current!.getBoundingClientRect();
        let otherKnobPos = (otherKnobRect.left - rect.left) / rect.width;
        let setKnobPos: React.Dispatch<React.SetStateAction<number>> = movingKnob.current === 0 ? setminKnobPos : setmaxKnobPos;
        let changeKnob = (otherKnob: number) => {
            movingKnob.current = otherKnob; // change current knob to other knob
            setActiveKnob(otherKnob);
            return movingKnob.current === 0 ? setminKnobPos : setmaxKnobPos;
        };
        if (props.allowOverlap) {
            if ((movingKnob.current === 0 && x > otherKnobRect.left) || (movingKnob.current === 1 && x < otherKnobRect.left)) {
                setKnobPos(float2Decimal(otherKnobPos, 4)); // set current knob position to exact same as other knob first
                if (props.stopOnOverlap) return;
                setKnobPos = changeKnob(otherKnob);
            }
        }
        else {
            let movingKnobValue = Math.round(newPos * props.intervals);
            let otherKnobValue = Math.round(otherKnobPos * props.intervals);
            if ((movingKnob.current === 0 && movingKnobValue >= otherKnobValue) || (movingKnob.current === 1 && movingKnobValue <= otherKnobValue)) {
                if (props.stopOnOverlap) return;
                setKnobPos = changeKnob(otherKnob);
            }
        }
        setKnobPos(float2Decimal(closest, 4));
    }

    let onDown = (pos: [number, number], changeKnobPos: Function) => {
        let rect = sliderRef.current!.getBoundingClientRect(); // get color picker global position
        let sliderPos = (pos[0] - rect.left) / rect.width;
        movingKnob.current = sliderPos < minKnobPos || Math.abs(sliderPos - minKnobPos) < Math.abs(sliderPos - maxKnobPos) ? 0 : 1;
        setActiveKnob(movingKnob.current);
        changeKnobPos(pos);
        let move = (e: PointerEvent) => changeKnobPos([e.clientX, e.clientY]);
        let up = () => {
            movingKnob.current = -1;
            setActiveKnob(-1);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        }
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
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
