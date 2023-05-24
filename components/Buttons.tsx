import '../tailwind.config.js'
import { ButtonProps, KernButtonProps } from '../types/buttons.js';

function combineClassNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
export function KernButton(props: KernButtonProps) {
    return (
        <button
            type={props.buttonType || "button"}
            className={combineClassNames(
                props.className || "border-gray-300 bg-white text-gray-700 hover:bg-gray-50", // copy this, and replace it with a color if you want to change the color
                "items-center rounded-md border px-4 py-2.5 text-xs font-medium shadow-sm focus:outline-none",
                props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"
            )}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon && (
                <props.icon className="h-5 w-5 mr-2" aria-hidden="true" />
            )}
            {props.buttonName}
        </button>
    );
}


export function AddButton(props: ButtonProps) {
    return <KernButton buttonName="Add" disabled={props.disabled} onClick={props.onClick} className="border-green-400 bg-green-100 text-green-700 hover:bg-green-50" />;
}

export function SaveButton(props: ButtonProps) {
    return <KernButton buttonName="Save" disabled={props.disabled} onClick={props.onClick} className="border-green-400 bg-green-100 text-green-700 hover:bg-green-50" />;
}

export function DeleteButton(props: ButtonProps) {
    return <KernButton buttonName="Delete" onClick={props.onClick} />;
}

export function CloseButton(props: ButtonProps) {
    return <KernButton buttonName="Close" onClick={props.onClick} />;
}

export function RemoveButton(props: ButtonProps) {
    return <KernButton buttonName="Remove" onClick={props.onClick} />;
}