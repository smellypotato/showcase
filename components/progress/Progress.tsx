import { useEffect, useState } from "react";
import "./Progress.css";

export const Progress = (props: {percentage: number, thickness: number}) => {
    const circumference = 2 * Math.PI * (100 - props.thickness) / 2;
    const dashOffset = ((100 - props.percentage) / 100 * circumference);
    const interpolateColor = (startColor: string, endColor: string, ratio: number) => {
        // Convert the hex colors to RGB values
        const [r1, g1, b1] = startColor.replace(/^#+/, '').match(/.{1,2}/g)!.map(color => parseInt(color, 16));
        const [r2, g2, b2] = endColor.replace(/^#+/, '').match(/.{1,2}/g)!.map(color => parseInt(color, 16));

        // Calculate the new color in RGB
        const r = Math.round(r1 + (r2 - r1) * Math.sin(Math.PI / 2 * ratio));
        const g = Math.round(g1 + (g2 - g1) * Math.sin(Math.PI / 2 * ratio));
        const b = Math.round(b1 + (b2 - b1) * Math.sin(Math.PI / 2 * ratio));

        // Convert the RGB values to hex code
        const hex = ((r << 16) | (g << 8) | b).toString(16);
        return '#' + ('000000' + hex).slice(-6);
    }
    const updateColor = (p: number) => interpolateColor("#DC0508", "#54A11B", p);
    const [color, setColor] = useState(updateColor(props.percentage / 100));

    useEffect(() => setColor(updateColor(props.percentage / 100)), [props.percentage]);

    return (
        <svg className="progress_container" width={100} height={100} viewBox="0 0 100 100" style={{ "--percentage": props.percentage / 100} as React.CSSProperties}>
            <circle cx="50" cy="50" r={50 - (props.thickness || 2) / 2} fill="#0009" />
            <circle className="progress" cx="50" cy="50" r={50 - (props.thickness || 2) / 2} fill="none" stroke={color} strokeWidth={props.thickness || 2} style={{ strokeDasharray: 2 * Math.PI * (50 - (props.thickness || 2) / 2), strokeDashoffset: dashOffset }} />
            {<text x="50" y="52">{props.percentage}</text>}
        </svg>
    )
}

export const ModernProgress = (props: {percentage: number, thickness: number}) => {
    const interpolateColor = (startColor: string, endColor: string, ratio: number) => {
        // Convert the hex colors to RGB values
        const [r1, g1, b1] = startColor.replace(/^#+/, '').match(/.{1,2}/g)!.map(color => parseInt(color, 16));
        const [r2, g2, b2] = endColor.replace(/^#+/, '').match(/.{1,2}/g)!.map(color => parseInt(color, 16));

        // Calculate the new color in RGB
        const r = Math.round(r1 + (r2 - r1) * Math.sin(Math.PI / 2 * ratio));
        const g = Math.round(g1 + (g2 - g1) * Math.sin(Math.PI / 2 * ratio));
        const b = Math.round(b1 + (b2 - b1) * Math.sin(Math.PI / 2 * ratio));

        // Convert the RGB values to hex code
        const hex = ((r << 16) | (g << 8) | b).toString(16);
        return '#' + ('000000' + hex).slice(-6);
    }
    const updateColor = (p: number) => interpolateColor("#DC0508", "#54A11B", p);
    const [color, setColor] = useState(updateColor(props.percentage / 100));
    useEffect(() => setColor(updateColor(props.percentage / 100)), [props.percentage]);
    
    return (
        <div className="new_pie_display animate" style={ { "--color": color, "--size": `${100}px`, "--modern_percentage": props.percentage } as React.CSSProperties }>{props.percentage}</div>
    )
}