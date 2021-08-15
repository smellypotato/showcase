import { useEffect, useState } from "react";
import "./colorPicker.css";

export interface RGB {
    R: number,
    G: number,
    B: number
}
export enum ColorChannel { R = "R", G = "G", B = "B" }
const maxColors: Array<RGB> = [
    { R: 255, G: 0, B: 0 },
    { R: 255, G: 255, B: 0 },
    { R: 0, G: 255, B: 0 },
    { R: 0, G: 255, B: 255 },
    { R: 0, G: 0, B: 255 },
    { R: 255, G: 0, B: 255 },
    { R: 255, G: 0, B: 0 }
]

export const ColorPicker = (props: { size: number, onChangeColor: Function }) => {
    let currentMaxColor: RGB = { R: 255, G: 0, B: 0 };

    let [pickerPos, setPickerPos] = useState({ left: 0, top: 0 });
    let [color, setColor] = useState({ R: 0, G: 0, B: 0 });

    useEffect(() => {
        setColor({
            R: getColorChannel(ColorChannel.R, currentMaxColor),
            G: getColorChannel(ColorChannel.G, currentMaxColor),
            B: getColorChannel(ColorChannel.B, currentMaxColor)
        })
    }, [pickerPos]);

    useEffect(() => props.onChangeColor(color), [color]);

    let lerp = (start: number, end: number, ratio: number) => {
        return start + (ratio - 0) * (end - start) / (1 - 0);
    }


    let getColorChannel = (channel: ColorChannel, maxColor: RGB) => {
        let maxColor2White = lerp(255, maxColor[channel], pickerPos.left / props.size);
        let finalColor = lerp(maxColor2White, 0, pickerPos.top / props.size);
        return Math.round(finalColor);
    }

    let getInvertedColorChannel = (channel: ColorChannel, maxColor: RGB) => {
        let maxColor2White = lerp(maxColor[channel], 255, pickerPos.left / props.size);
        let finalColor = lerp(0, maxColor2White, pickerPos.top / props.size);
        return Math.round(finalColor);
    }

    let changePickerPos = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
        let rect = e.currentTarget!.getBoundingClientRect(); // get color picker global position
        console.log(e.currentTarget!.getBoundingClientRect());
        let [x, y] = [e.clientX, e.clientY]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        if (y < rect.top) y = rect.top;
        else if (y > rect.bottom) y = rect.bottom;
        setPickerPos({ left: x - rect.left, top: y - rect.top });
    }

    let onDown = (e: React.PointerEvent<HTMLDivElement>) => {
        changePickerPos(e);
        let move = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => changePickerPos(e);
        let up = () => {
            document.body.removeEventListener("pointermove", move);
            document.body.removeEventListener("pointerup", up);
        }
        document.body.addEventListener("pointermove", move);
        document.body.addEventListener("pointerup", up);
    }

    return (
        <div className="color-picker">
            <div className='color-picker-container' style={ {
                width: `${props.size}px`
            } } onPointerDown={ onDown }>
                <div className="color-picker-panel no_highlight" style={ { width: `${props.size}px` } }/>
                <div className="color-picker-indicator no_highlight" style={ { left: pickerPos.left, top: pickerPos.top, borderColor: `rgb(${getInvertedColorChannel(ColorChannel.R, currentMaxColor)}, ${getInvertedColorChannel(ColorChannel.G, currentMaxColor)}, ${getInvertedColorChannel(ColorChannel.B, currentMaxColor)}` } }/>
            </div>
            <div className="color-picker-max-color-selector" />
        </div>
    )
}
