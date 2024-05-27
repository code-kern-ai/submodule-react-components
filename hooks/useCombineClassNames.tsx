import { DependencyList, useMemo } from 'react';


// wrap class combination in a memo to prevent constant recalculation during rerendering
// this will increase memory consumption since the values is memoized in memory
// should only be used for often rerendered components / className lists with a lot of combinations
//
// note that using this inline for a classList only works for components without an early return path
// if you have an early return path, you should use this in a separate variable before the early return
// this is caused by react standard logic to have the same amount of hooks on every render
export function useCombineClassNames(deps: DependencyList, ...classes: string[]): string {
    // fake cast to prevent typescript issues with useMemo return type
    return useMemo(() => classes.join(' '), deps) as unknown as string
}
