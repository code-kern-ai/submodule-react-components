import { Dispatch, SetStateAction, useEffect } from "react";
import useEnumOptionsTranslated from "./useEnumOptionsTranslated";
import useRefState from "../useRefState";
//TODO: build one for without translation so we can use it outside of cognition as well

// only works if the corresponding enum is translated in the i18n file with the lookupKey
// example: cognition-ui> PATExpiresAt
export default function useEnumStateTranslated<T>(enumObj: T, lookupKey: string, translationScope?: string): [
    { name: string, value: T },
    Dispatch<SetStateAction<{ name: string; value: T; }>>,
    { name: string, value: T }[]
] {
    const _translationScope = translationScope || 'enums';
    const options = useEnumOptionsTranslated(enumObj, lookupKey, _translationScope);
    const { state, setState, ref } = useRefState(options[0]);
    useEffect(() => {
        if (!ref.current) return;
        const newOption = options.find(e => e.value == ref.current.value);
        if (newOption) setState(newOption);
    }, [options]);

    return [state, setState, options]
}