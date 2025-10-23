import { combineClassNames } from "@/submodules/javascript-functions/general";
import { Switch } from "@headlessui/react";
import { Tooltip } from "@nextui-org/react";
import { useMemo } from "react";
import { MemoIconAlertTriangle } from "./kern-icons/icons";


type Props = {
    checked: boolean;
    onChange: () => void;
    label: string;
    colorLabel?: string;
    colorActive?: string;
    colorInactive?: string;
    addClassesGroup?: string;
    tooltip?: string;
    disabled?: boolean;
}

export default function SwitchWithLabel(props: Props) {
    const finalColorActive = props.colorActive || 'bg-green-600';
    const finalColorInactive = props.colorInactive || 'bg-gray-200';
    const finalColorLabel = props.colorLabel || 'text-gray-700';

    const tooltip = useMemo(() => props.tooltip ? <Tooltip content={props.tooltip} color="invert" placement="top" className="cursor-default"><MemoIconAlertTriangle className="w-6 h-6" /></Tooltip> : null, [props.tooltip])

    return <Switch.Group as="div" className={combineClassNames("flex items-center justify-between disabled-within:opacity-50 disabled-within:cursor-not-allowed", props.addClassesGroup)}>
        <Switch.Description as="span" className={`font-medium ${finalColorLabel}`}>
            {props.label}
        </Switch.Description>
        <div className="flex flex-row gap-x-2 items-center">
            <Switch
                checked={props.checked}
                onChange={props.onChange}
                className={combineClassNames(
                    props.checked ? finalColorActive : finalColorInactive,
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
                )}
                disabled={props.disabled}
            >
                <span
                    aria-hidden="true"
                    className={combineClassNames(
                        props.checked ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
            {tooltip}
        </div>
    </Switch.Group>
}