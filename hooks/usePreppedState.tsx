import { useState, useCallback, useEffect } from 'react';

//wrapper to use state for prep function
type prepFunction<T> = {
    f: (stateValue: T) => T,
}

// returns [state, setState, setPrepFunction]
export function usePreppedState<T>(
    initialValue: T | null,
    prepFunction?: (stateValue: T) => T,
): [T | null, (stateValue: T) => void, (f: (stateValue: T) => T) => void] {
    const [prepFunc, setPrepFunc] = useState({ f: prepFunction } as prepFunction<T>);
    const [state, setState] = useState<T | any>(initialValue);
    const [preppedState, setPreppedState] = useState<T | any>();

    //wrapper so a function can be passed directly
    const setPrepFuncWrapper = useCallback((func: (stateValue: T) => T) => {
        setPrepFunc({ f: func } as prepFunction<T>);
    }, []);

    useEffect(() => {
        if (prepFunc && prepFunc.f) setPreppedState(prepFunc.f(state));
        else setPreppedState(state);
    }, [state, prepFunc])


    return [preppedState, setState, setPrepFuncWrapper];
}
