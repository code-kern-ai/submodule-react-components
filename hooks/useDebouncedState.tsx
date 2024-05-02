import { useState, Dispatch } from 'react';
import useDebounce from './useHooks/useDebounce';

export function useDebouncedState<T>(initialValue: T | null, debounceDelay: number = 250): [T | null, Dispatch<any>, T | null] {

    const [state, setState] = useState<T | any>(initialValue);
    const debounced = useDebounce(state, debounceDelay);

    return [state, setState, debounced];
}
