import "./snakePage.css";
import { Snake } from "./snake";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLastKeyPress } from "../../hooks/useLastKeyPress";
import { useKeyPress } from "../../hooks/useKeyPress";


export type PointType = [number, number];
export type BodyType = [PointType, PointType];
export type SnakeType = Array<BodyType>;
export enum DIRECTION {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

export const SnakePage = () => {

    const cloneArray = useCallback(function <T extends SnakeType | BodyType | PointType>(originalArr: T) {
        return JSON.parse(JSON.stringify(originalArr)) as T;
    }, [])

    const snakeRef = useRef<SnakeType>([]);
    const [snake, setSnake] = useState(cloneArray(snakeRef.current))

    const directionRef = useRef(DIRECTION.RIGHT);
    const [direction, setDirection] = useState(directionRef.current);

    const targetRef = useRef<PointType>();
    const [target, setTarget] = useState(targetRef.current);

    const keyPressing = useLastKeyPress(["w", "a", "s", "d"]);
    const start = useKeyPress(" ");
    const stop = useKeyPress("Enter");
    const restart = useKeyPress("r");
    const gameInterval = useRef(-1);

    const scoreRef = useRef(0)
    const [score, setScore] = useState(scoreRef.current);
    const speedRef = useRef(5);

    const initSnake = () => {
        let newSnake: SnakeType = [];
        newSnake.push([[-1, -1], [10, 10]]);
        newSnake.push([[10, 10], [10, 9]]);
        newSnake.push([[10, 9], [9, 9]]);
        newSnake.push([[9, 9], [9, 10]]);
        newSnake.push([[9, 10], [8, 10]]);
        snakeRef.current = newSnake;
        setSnake(cloneArray(snakeRef.current));
    }

    useEffect(initSnake, []);

    useEffect(() => {
        switch (keyPressing) {
            case "w":
                if (direction !== DIRECTION.DOWN) directionRef.current = DIRECTION.UP;
            break;
            case "a":
                if (direction !== DIRECTION.RIGHT) directionRef.current = DIRECTION.LEFT;
            break;
            case "s":
                if (direction !== DIRECTION.UP) directionRef.current = DIRECTION.DOWN;
            break;
            case "d":
                if (direction !== DIRECTION.LEFT) directionRef.current = DIRECTION.RIGHT;
            break;
        }
    }, [keyPressing]);

    useEffect(() => {
        if (start && gameInterval.current === -1) {
            generateTarget();
            startGame(speedRef.current)
        }
    }, [start]);

    useEffect(() => {
        if (target) {
            if (Math.ceil(score / 10) > speedRef.current) {
                speedRef.current = Math.ceil(score / 10);
                startGame(speedRef.current);
            }
        }
    }, [score])

    useEffect(() => {
        stop && stopGame();
    }, [stop]);

    useEffect(() => {
        if (restart) {
            stopGame();
            initSnake();
            directionRef.current = DIRECTION.RIGHT;
            setDirection(directionRef.current);
            scoreRef.current = 0;
            setScore(scoreRef.current);
            targetRef.current = undefined;
            setTarget(targetRef.current);
        }
    }, [restart]);

    const startGame = (speed: number) => { // speed = number of grid per second
        clearInterval(gameInterval.current);
        gameInterval.current = window.setInterval(() => {
            move();
        }, 1000 / speed);
    }

    const stopGame = () => {
        console.log("stop game");
        clearInterval(gameInterval.current);
        gameInterval.current = -1;
    }

    const move = () => {
        let newSnake: SnakeType = cloneArray(snakeRef.current);
        newSnake.forEach((body, i) => {
            if (body[0].every(value => value === -1)) { // head
                switch (directionRef.current) {
                    case DIRECTION.UP:
                        body[1][0] -= 1;
                    break;
                    case DIRECTION.DOWN:
                        body[1][0] += 1;
                    break;
                    case DIRECTION.LEFT:
                        body[1][1] -= 1;
                    break;
                    case DIRECTION.RIGHT:
                        body[1][1] += 1;
                    break;
                }
            }
            else { // body
                body[1] = cloneArray(body[0]);
                body[0] = cloneArray(newSnake[i - 1][1]);
            }
        })
        if (checkCollision(newSnake)) {
            alert("Game End!");
            stopGame();
            return;
        }
        if (checkEatTarget(newSnake)) {
            scoreRef.current++
            setScore(scoreRef.current);
            newSnake = cloneArray(snakeRef.current);
            newSnake.unshift([[-1, -1], targetRef.current!]);
            newSnake[1][0] = cloneArray(newSnake[0][1]);
            generateTarget();
        }
        snakeRef.current = newSnake;
        setSnake(newSnake);
        setDirection(directionRef.current);
    }

    const checkCollision = (snake: SnakeType) => {
        let head = snake[0][1];

        // collide wall
        if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) return true;

        // collide body
        if (snake.filter(body => head.every((value, i) => value === body[1][i])).length > 1) return true;

        return false;
    }

    const generateTarget = () => {
        let newTarget: PointType = [-1, -1];
        do {
            newTarget[0] = Math.floor(Math.random() * (20 - 0) + 0);
            newTarget[1] = Math.floor(Math.random() * (20 - 0) + 0);
        } while (snakeRef.current.some(body => newTarget.every((value, i) => value === body[1][i])));
        targetRef.current = newTarget
        setTarget(newTarget);
    }

    const checkEatTarget = (snake: SnakeType) => {
        let head = snake[0][1];
        if (head.every((value, i) => value === targetRef.current![i])) return true;
    }

    return (
        <div id="snake-page">
            <h1>Snake</h1>
            <br />
            <h5>Press Space Bar to start. Press Enter to Stop. Use WASD to navigate.</h5>
            <br />
            <div>Score: { score }</div>
            <br />
            <Snake col={ 20 } row={ 20 } snake={ snake } direction={ direction } target={ target }/>
        </div>
    )
}
