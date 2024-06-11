import { useEffect, MutableRefObject, useRef } from 'react';


// wrapper for ref that updates when the state changes
export default function useRefFor<T>(state: T | null): MutableRefObject<T> {
    const ref = useRef(state);
    useEffect(() => { ref.current = state }, [state]);
    return ref;
}
