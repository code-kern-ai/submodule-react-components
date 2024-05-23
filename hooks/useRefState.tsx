import { useState, Dispatch, useRef, useEffect, MutableRefObject, SetStateAction } from 'react';


// adds a state and a ref to that state that can always be accessed. The ref can be used in functions without the dependency of the state.
// a set triggers a rerender and an update to the ref.
export default function useRefState<T>(initialValue: T | null): { state: T | null, setState: Dispatch<SetStateAction<T>>, ref: MutableRefObject<T> } {

    const [state, setState] = useState<T | any>(initialValue);
    const ref = useRef(state);
    useEffect(() => { ref.current = state }, [state]);
    return { state, setState, ref };
}
