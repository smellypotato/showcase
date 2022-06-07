import { useEffect, useRef, useState } from "react";
import "./timerPage.css";

export const TimerPage = () => {

    const timer1Ref = useRef(0);
    const timer2Ref = useRef(0);

    const [timer1, setTimer1] = useState(timer1Ref.current);
    const [timer2, setTimer2] = useState(timer2Ref.current);

    const [startTime] = useState(new Date());

    useEffect(() => {
        // common method, use setInterva to increase timer by 1
        // will delay when long time
        setInterval(() => {
            timer1Ref.current += 1;
            setTimer1(timer1Ref.current);
        }, 1000);
    }, []);

    useEffect(() => {
        // use time difference to calculated timer
        // will not delay, will be affected if user change time
        const startTime = new Date();
        setInterval(() => {
            const currentTime = new Date();
            timer2Ref.current = currentTime.valueOf() - startTime.valueOf();
            setTimer2(Math.floor(timer2Ref.current / 1000));
        }, 100)
    }, [])

    return (
        <div id="timer-page">
            <h1>Time start: { `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}` }</h1>
            <h1>Inaccurate Timer</h1>
            <h2>Time passed: { timer1 } seconds</h2>
            <h1>Accurate Timer</h1>
            <h2>Time passed: { timer2 } seconds</h2>
        </div>
    )
}
