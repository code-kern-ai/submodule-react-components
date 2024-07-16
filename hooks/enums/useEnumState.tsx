import { Dispatch, SetStateAction, useEffect } from "react";
import useEnumOptionsTranslated from "./useEnumOptionsTranslated";
import useRefState from "../useRefState";
import useEnumOptions from "./useEnumOptions";
import { enumToArrayOptions } from "@/submodules/javascript-functions/general";

export default function useEnumState<T>(enumObj: Object, conversionOptions?: enumToArrayOptions): [
    { name: string, value: T },
    Dispatch<SetStateAction<{ name: string; value: T; }>>,
    { name: string, value: T }[]
] {
    const options = useEnumOptions<T>(enumObj, conversionOptions);
    const { state, setState, ref } = useRefState(options[0]);
    useEffect(() => {
        if (!ref.current) return;
        const newOption = options.find(e => e.value == ref.current.value);
        if (newOption) setState(newOption);
    }, [options]);

    return [state, setState, options]
}