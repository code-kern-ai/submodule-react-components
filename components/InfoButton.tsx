import { combineClassNames } from "@/submodules/javascript-functions/general";
import { useDefaults } from "@/submodules/react-components/hooks/useDefaults";
import { IconInfoCircle } from "@tabler/icons-react";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/submodules/react-components/hooks/useHooks/useOnClickOutside";
import { Transition } from "@headlessui/react";
import { INFO_BUTTON_DEFAULT_VALUES, InfoButtonConfig, InfoButtonProps } from "../types/infoButton";


function generateAndCheckConfig(props: InfoButtonProps, setOpen: Dispatch<SetStateAction<boolean>>): InfoButtonConfig {
    const config: any = {};
    switch (props.infoButtonSize) {
        case "xs": config.size = 16; break;
        case "sm": config.size = 24; break;
        case "md": config.size = 48; break;
        case "lg": config.size = 96; break;
        default:
            console.error("InfoButton - Invalid size")
    }
    config.cursorClass = props.access == 'hover' ? 'cursor-help' : "cursor-pointer";
    if (props.divPosition) {
        switch (props.divPosition) {
            case "top": config.positionClass = "-translate-x-1/2 left-1/2 bottom-full"; break;
            case "bottom": config.positionClass = "-translate-x-1/2 left-1/2 top-full"; break;
            case "left": config.positionClass = "-translate-y-1/2 top-1/2 right-full"; break;
            case "right": config.positionClass = "-translate-y-1/2 top-1/2 left-full"; break;
        }
    } else config.positionClass = "";


    config.showInfo = () => setOpen(true);
    config.hideInfo = () => setOpen(false);

    return config;
}


export function InfoButton(_props: InfoButtonProps) {
    const [props] = useDefaults<InfoButtonProps>(_props, INFO_BUTTON_DEFAULT_VALUES);
    const [config, setConfig] = useState<InfoButtonConfig>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => setConfig(generateAndCheckConfig(props, setOpen)), [props.infoButtonSize, props.access, props.display, props.divPosition]);

    if (!config) return null;
    return (
        <div className={combineClassNames("relative w-fit p-1", config.cursorClass)} onClick={props.access == 'click' ? config.showInfo : undefined} onMouseEnter={props.access == 'hover' ? config.showInfo : undefined} onMouseLeave={props.access == 'hover' ? config.hideInfo : undefined}>
            <IconInfoCircle size={config.size} className={props.infoButtonColorClass} />
            {props.display == "absoluteDiv" ? <RenderDiv
                positionClass={config.positionClass + " " + props.addClasses}
                content={props.content}
                open={open}
                access={props.access}
                onMouseEnter={config.showInfo}
                onMouseLeave={config.hideInfo}
                zIndexClass={props.divZIndexClass} /> : null}
        </div>
    )
}

function RenderDiv({ positionClass, open, content, access, onMouseEnter, onMouseLeave, zIndexClass }: { positionClass: string, open: boolean, content: string | JSX.Element, access: string, onMouseEnter: () => void, onMouseLeave: () => void, zIndexClass: string }) {
    const ref = useRef(null);
    useOnClickOutside(ref, onMouseLeave);
    return (
        <Transition.Root show={open} as={Fragment} >
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-out duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div ref={ref} className={combineClassNames("absolute bg-blue-50 p-2 border border-blue-400 cursor-auto", positionClass, zIndexClass)} onMouseEnter={access == 'hover' ? onMouseEnter : undefined} onMouseLeave={access == 'hover' ? onMouseLeave : undefined} >
                    {typeof content == "string" ?
                        <div className="flex items-center gap-x-2">
                            <div className="flex-shrink-0">
                                <IconInfoCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <p className="text-sm text-blue-700 w-max max-w-sm">{content}</p>
                        </div> : content}
                </div>
            </Transition.Child>
        </Transition.Root>
    )
}