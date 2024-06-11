


import { useReducer } from "react"

//https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
export function useForceRerender() {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return forceUpdate;
}