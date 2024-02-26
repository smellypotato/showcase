import React from "react";

import "./calendar.css";
import "./calendarPage.css";
import { Calendar } from "./calender";

export class CalendarPage extends React.Component<{}, { date: Date }> {
    state = {
        date: new Date()
    }

    onChangeDate(date: Date) {
        this.setState({ date: date });
    }

    render() {
        let today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return (
            <div id="calendar-page">
                <div className="f_24">Calendar</div>
                <div className="f_16"></div>
                <div id="calendar-page-calendar">
                    <Calendar calendarIndex={ 1 } calendar={ new Date(today.getFullYear(), today.getMonth()) } selectedDays={ [this.state.date, this.state.date] } onChangeMonth={ () => {} } onChangeSelectedDay={ this.onChangeDate.bind(this) } />
                </div>
            </div>
        )
    }
}
