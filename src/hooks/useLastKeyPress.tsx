import { useCallback, useEffect, useState } from "react";

export const useLastKeyPress = (registerKeys: Array<string>) => {
    // const keysPressedRef = useRef([""]);
    const [keyPressed, setKeyPressed] = useState("");

    const onDown = useCallback((e: KeyboardEvent) => {
        if (registerKeys.includes(e.key) && keyPressed !== e.key) {
            setKeyPressed(e.key);
        }
    }, [registerKeys]);

    const onUp = useCallback((e: KeyboardEvent) => {
        if (registerKeys.includes(e.key) && keyPressed === e.key) {
            setKeyPressed("");
        }
    }, [registerKeys]);

    useEffect(() => {
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        return () => {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
        }
    }, [onDown, onUp]);

    return keyPressed;
}
