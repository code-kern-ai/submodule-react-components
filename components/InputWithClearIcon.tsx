import { IconX } from "@tabler/icons-react";

export type InputWithClearIconProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function InputWithClearIcon(props: InputWithClearIconProps) {
    return (<div className="relative">
        <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
        />
        {props.value && (
            <IconX className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500' onClick={() => props.onChange("")} />
        )}
    </div>)
}