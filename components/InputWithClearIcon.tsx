import { useCallback } from "react";
import { MemoIconX } from "./kern-icons/icons";
import useRefFor from "../hooks/useRefFor";

export type InputWithClearIconProps = {
    value: string;
    onChange: (value: string) => void;
    classNames?: string;
    id?: string;
    placeholder?: string;
}

export default function InputWithClearIcon(props: InputWithClearIconProps) {
    const clearInputRef = useRefFor(props.onChange)
    const clearInput = useCallback(() => {
        clearInputRef.current('');
    }, [props.onChange]);

    return (<div className={`relative ${props.classNames}`}>
        <input id={props.id} type="text" placeholder={props.placeholder ?? "Search"}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
        />
        {props.value && (
            <MemoIconX className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500' onClick={clearInput} />
        )}
    </div>)
}