import { useCallback, useEffect, useState } from "react";

export const useKeyPress = (key: string) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const onDown = useCallback((e: KeyboardEvent) => {
        e.key === key && setKeyPressed(true);
    }, [key])
    const onUp = useCallback((e: KeyboardEvent) => {
        e.key === key && setKeyPressed(false);
    }, [key]);

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
