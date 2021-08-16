import { useEffect, useRef, useState } from "react";
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
    { R: 255, G: 0, B: 0 },
    { R: 255, G: 0, B: 0 }
]

export const ColorPicker = (props: { size: number, onChangeColor: Function }) => {
    let colorPickerPanelRef = useRef<HTMLDivElement>(null);
    let maxColorPickerPanelRef = useRef<HTMLDivElement>(null);

    let [maxPickerPos, setMaxPickerPos] = useState(0);
    let [maxColor, setMaxColor] = useState<RGB>({ R:255, G: 0, B: 0 });
    let [pickerPos, setPickerPos] = useState<{ left: number, top: number}>({ left: 0, top: 0 });
    let [color, setColor] = useState<RGB>({ R: 0, G: 0, B: 0 });

    useEffect(() => {
        setColor({
            R: getColorChannel(ColorChannel.R, maxColor),
            G: getColorChannel(ColorChannel.G, maxColor),
            B: getColorChannel(ColorChannel.B, maxColor)
        })
    }, [pickerPos, maxColor]);

    useEffect(() => props.onChangeColor(rgb2hex(color)), [color]);

    useEffect(() => {
        setMaxColor({
            R: getMaxColorChannel(ColorChannel.R),
            G: getMaxColorChannel(ColorChannel.G),
            B: getMaxColorChannel(ColorChannel.B)
        })
    }, [maxPickerPos]);

    let lerp = (start: number, end: number, ratio: number) => {
        return start + (ratio - 0) * (end - start) / (1 - 0);
    }

    let rgb2hex = (rgb: RGB): string => {
        let RR = rgb.R.toString(16).toUpperCase().padStart(2, "0");
        let GG = rgb.G.toString(16).toUpperCase().padStart(2, "0");
        let BB = rgb.B.toString(16).toUpperCase().padStart(2, "0");
        return `#${RR}${GG}${BB}`;
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

    let getMaxColorChannel = (channel: ColorChannel) => {
        let ratio: number = maxPickerPos / props.size;
        let indexLength: number = 1 / (maxColors.length - 2);
        let maxColorIndex = Math.floor(ratio / indexLength);
        let normalizedRatio = ratio / indexLength - maxColorIndex;
        let finalColor = lerp(maxColors[maxColorIndex][channel], maxColors[maxColorIndex + 1][channel], normalizedRatio);
        return Math.round(finalColor);
    }

    let changePickerPos = (pointerPos: [number, number]) => {
        let rect = colorPickerPanelRef.current!.getBoundingClientRect(); // get color picker global position
        let [x, y] = pointerPos; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        if (y < rect.top) y = rect.top;
        else if (y > rect.bottom) y = rect.bottom;
        setPickerPos({ left: x - rect.left, top: y - rect.top });
    }

    let changeMaxPickerPos = (pointerPos: [number, number]) => {
        let rect = maxColorPickerPanelRef.current!.getBoundingClientRect(); // get color picker global position
        let x = pointerPos[0]; // get pointer global position
        // check overflow
        if (x < rect.left) x = rect.left;
        else if (x > rect.right) x = rect.right;
        setMaxPickerPos(x - rect.left);
    }

    let onDown = (pointerPos: [number, number], changePickerPos: Function) => {
        changePickerPos(pointerPos);
        let move = (e: PointerEvent) => changePickerPos([e.clientX, e.clientY]);
        let up = () => {
            document.body.removeEventListener("pointermove", move);
            document.body.removeEventListener("pointerup", up);
        }
        document.body.addEventListener("pointermove", move);
        document.body.addEventListener("pointerup", up);
    }

    return (
        <div className="color-picker">
            <div ref={ colorPickerPanelRef } className='color-picker-panel no_highlight' style={ {
                width: `${props.size}px`,
                background: `linear-gradient(#FFFFFF, #000000), linear-gradient(to right, #FFFFFF, ${rgb2hex(maxColor)})`
            } } onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changePickerPos) }>
                <div className="color-picker-indicator no_highlight" style={ { left: pickerPos.left, top: pickerPos.top, borderColor: `rgb(${getInvertedColorChannel(ColorChannel.R, maxColor)}, ${getInvertedColorChannel(ColorChannel.G, maxColor)}, ${getInvertedColorChannel(ColorChannel.B, maxColor)}` } }/>
            </div>
            <div ref={ maxColorPickerPanelRef } className="color-picker-max-color-selector" onPointerDown={ (e: React.PointerEvent<HTMLDivElement>) => onDown([e.clientX, e.clientY], changeMaxPickerPos) }>
                <div className="color-picker-max-color-picker" style={ { left: maxPickerPos } }>
                    <div />
                    <div />
                </div>
            </div>
        </div>
    )
}
