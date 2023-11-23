import { useEffect } from 'react';

export function useConsoleLog<T>(
    state: T | null, indicator: string = ""
) {
    useEffect(() => {
        console.log(indicator, state);
    }, [state])
}
