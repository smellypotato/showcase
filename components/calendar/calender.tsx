import React from "react";

import "./calendar.css";

const WEEKDAYS: Array<number> = Array.from({ length: 7 }, (_value, i) => i);

export const Calendar = (props: { calendarIndex: number, calendar: Date, selectedDays: Array<Date>, onChangeMonth: React.MouseEventHandler<HTMLDivElement>, onChangeSelectedDay: Function }) => {
    let year = props.calendar.getFullYear();
    let month = props.calendar.getMonth();
    let today: Date = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let daysInMonth: number = new Date(year, month + 1, 0).getDate(); // month + 1 = next month, date 0 = previous date
    let firstDayInWeek: number = props.calendar.getDay();

    let generatePrecedingNodes = () => {
        return Array.from({ length: firstDayInWeek }, _value => _value).map(_precede => <div className={`calendar-node`} />)
    }

    let generateDays = () => {
        return Array.from({ length: daysInMonth }, (_value, i) => i).map(day => {
            let nodeDate: Date = new Date(year, month, day + 1);
            let nodeClass: string = "calendar-node";
            let textClass: string = "calendar-node-text";

            let selectedDaysValue: Array<number> = props.selectedDays.map(days => days.valueOf())
            let nodeSelectedIndex: number = selectedDaysValue.indexOf(nodeDate.valueOf()); // node date index in selected days

            if (nodeDate >= today) nodeClass += " cursor-button color_grey_1"; // can click
            if (nodeDate > props.selectedDays[0] && nodeDate < props.selectedDays[1]) nodeClass += " bg_sec_tint";
            else if (nodeSelectedIndex !== -1) { // cannot directly compare two dates
                if (!selectedDaysValue.every(value => value === nodeDate.valueOf())) nodeClass += ` calendar-node-selected-${nodeSelectedIndex}`;
                textClass += " calendar-node-text-selected bg_sec_shade_2 color_white";
            }
            return (
                <div className={nodeClass} onClick={() => props.onChangeSelectedDay(nodeDate)}>
                    <div className={textClass}>{day + 1}</div>
                </div>
            )}
        )
    }

    return (
        <div className="calendar bg_white no_highlight">
            <div className="calendar-title color_prim">
                {props.calendarIndex === 0 && new Date(year, month).valueOf() > new Date(today.getFullYear(), today.getMonth()).valueOf() ? <div className="cursor_button icon_left_arrow" onClick={ props.onChangeMonth} /> : <div />}
                <div>{`${year}年${month + 1}月`}</div>
                {props.calendarIndex === 1 ? <div className="cursor_button icon_right_arrow" onClick={ props.onChangeMonth } /> : <div />}
            </div>
            <div className="calendar-grid color_grey_2">
                { WEEKDAYS.map(weekday => <div className="calendar-node calendar-node-text color_prim">{ weekday }</div>) }
                { generatePrecedingNodes() }
                { generateDays() }
            </div>
        </div>
    )
}
