import { combineClassNames } from "@/submodules/javascript-functions/general";
import { useDefaults } from "@/submodules/react-components/hooks/useDefaults";
import { IconInfoCircle } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import BaseModal from "../../../src/components/Common/Modal";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import useOnClickOutside from "@/submodules/react-components/hooks/useHooks/useOnClickOutside";
import { useConsoleLog } from "@/submodules/react-components/hooks/useConsoleLog";

type InfoButtonProps = {
    content: string | JSX.Element;
    size?: "xs" | "sm" | "md" | "lg";
    access?: "hover" | "click";
    display?: "absoluteDiv" | "modal"
    divPosition?: "top" | "bottom" | "left" | "right"; // only for absoluteDiv relevant
}

type InfoConfig = {
    size: number;
    cursorClass: string;
    positionClass: string;
    hideInfo: () => void;
    showInfo: () => void;
}

function generateAndCheckConfig(props: InfoButtonProps, setOpen: Dispatch<SetStateAction<boolean>>): InfoConfig {
    if (props.access == "hover" && props.display == "modal") console.warn("InfoButton - Hover access and modal display are not recommended")
    const config: any = {};
    switch (props.size) {
        case "xs":
            config.size = 16;
            break;
        case "sm":
            config.size = 24;
            break;
        case "md":
            config.size = 48;
            break;
        case "lg":
            config.size = 96;
            break;
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

const DEFAULT_VALUES = {
    size: "sm",
    access: "hover",
    display: "absoluteDiv",
    divPosition: "top"
}

export function InfoButton(_props: InfoButtonProps) {
    const [props] = useDefaults<InfoButtonProps>(_props, DEFAULT_VALUES);
    const [config, setConfig] = useState<InfoConfig>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => setConfig(generateAndCheckConfig(props, setOpen)), [props.size, props.access, props.display]);

    if (!config) return null;


    return <>
        <div className={combineClassNames("relative w-fit p-1", config.cursorClass)} onClick={props.access == 'click' ? config.showInfo : undefined} onMouseEnter={props.access == 'hover' ? config.showInfo : undefined} onMouseLeave={props.access == 'hover' ? config.hideInfo : undefined}>
            {props.display == "absoluteDiv" ? <RenderDiv
                size={config.size}
                positionClass={config.positionClass}
                content={props.content}
                open={open}
                access={props.access}
                onMouseEnter={config.showInfo}
                onMouseLeave={config.hideInfo} /> : <IconInfoCircle size={config.size} />}
        </div>
        {props.display == "modal" ? <RenderModal content={props.content} open={open} setOpen={setOpen} /> : null}
    </>
}

function RenderDiv({ size, positionClass, open, content, access, onMouseEnter, onMouseLeave }: { size: number, positionClass: string, open: boolean, content: string | JSX.Element, access: string, onMouseEnter: () => void, onMouseLeave: () => void }) {
    const ref = useRef(null);
    useOnClickOutside(ref, onMouseLeave);
    return (<>
        <IconInfoCircle size={size} />
        <div ref={ref} className={combineClassNames("absolute bg-blue-50 p-2 border border-blue-400 cursor-auto z-50", positionClass, open ? '' : 'hidden')} onMouseEnter={access == 'hover' ? onMouseEnter : undefined} onMouseLeave={access == 'hover' ? onMouseLeave : undefined} >
            {typeof content == "string" ?
                <div className="flex items-center gap-x-2">
                    <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <p className="text-sm text-blue-700 w-max max-w-sm">{content}</p>
                </div> : content}
        </div>

    </>
    )
}

function RenderModal({ open, setOpen, content }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, content: string | JSX.Element }) {
    return (
        <BaseModal
            open={open}
            setOpen={setOpen}
            maxWidth='fit'
        >
            {typeof content == "string" ?
                <div className="flex flex-col items-center p-4">
                    <div className="flex flex-row items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        <span>Info</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-blue-700">{content}</p>
                    </div>
                </div> : content}
        </BaseModal>
    )
}