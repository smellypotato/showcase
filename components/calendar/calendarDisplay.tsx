import React, { useState } from "react";

import { Calendar } from "./calender";

import "./calendarDisplay.css";

// all month start from 0 = JAN
export const CalendarDisplay = (props: { selectedDays: Array<Date>, onChangeSelectedDay: Function }) => {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let thisMonth = new Date(today.getFullYear(), today.getMonth());
    let nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
    const [calendars, setCalendars] = useState([thisMonth, nextMonth]);

    let onChangeSelectedDay = (newDate: Date) => {
        if (newDate >= today) props.onChangeSelectedDay(newDate); // just take care new date is after today
    }

    let onChangeMonth = (direction: number) => {
        let originCalendars: Array<Date> = [...calendars];
        let newCalendars: Array<Date> = originCalendars.map(originCalendar => new Date(originCalendar.getFullYear(), originCalendar.getMonth() + direction));
        setCalendars(newCalendars);
    }

    return (
        <div id="calendar-display" className="bg_white">
            <Calendar calendarIndex={ 0 } calendar={ calendars[0] } selectedDays={ props.selectedDays } onChangeMonth={ onChangeMonth.bind(this, -1) } onChangeSelectedDay={ onChangeSelectedDay }/>
            <Calendar calendarIndex={ 1 } calendar={ calendars[1] } selectedDays={ props.selectedDays } onChangeMonth={ onChangeMonth.bind(this, 1) } onChangeSelectedDay={ onChangeSelectedDay }/>
        </div>
    )
}
