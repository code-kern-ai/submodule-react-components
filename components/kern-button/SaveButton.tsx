import React, { useCallback, useMemo, useState } from 'react';
import { IconDeviceFloppy, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { combineClassNames, } from "@/submodules/javascript-functions/general"
import { Tooltip } from '@nextui-org/react';
import { getButtonColorClasses, getDisabledClasses, getWidthClasses, getHeightClasses, getSizeClasses, buttonWarningColorClasses } from '../../helpers/button-helper';
import { Loading } from '@nextui-org/react';

type SaveButtonProps = {
    text?: string;
    iconColor?: string;
    onClick?: (event?) => void;
    buttonColor?: string;
    fullWidth?: boolean;
    fullHeight?: boolean;
    innerRef?: any;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
    tooltip?: string;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    confirm?: boolean;
    warningCue?: any
    className?: string;
}

export default function SaveButton(props: SaveButtonProps) {
    const [confirm, setConfirm] = useState(false);

    const handleButtonClick = useCallback((e) => {
        if (props.onClick) {
            props.onClick(e);
        }
        if (props.confirm) {
            setConfirm(true);
            setTimeout(() => {
                setConfirm(false);
            }, 3000);
        }
    }, [props.onClick, props.confirm]);

    const disabledClasses: string = useMemo(() => getDisabledClasses(props.disabled), [props.disabled]);

    const buttonColorClasses: string = useMemo(() => getButtonColorClasses(props.buttonColor), [props.buttonColor]);

    const widthClasses: string = useMemo(() => getWidthClasses(props.fullWidth), [props.fullWidth]);

    const heightClasses: string = useMemo(() => getHeightClasses(props.fullHeight), [props.fullHeight]);

    const sizeClasses: string = useMemo(() => getSizeClasses(props.size), [props.size]);

    const buttonClasses = useMemo(() => combineClassNames("flex gap-x-1 items-center hover:shadow-sm rounded-lg px-2 py-1", disabledClasses, buttonColorClasses, widthClasses, heightClasses, props.warningCue && buttonWarningColorClasses),
        [disabledClasses, buttonColorClasses, widthClasses, heightClasses, props.warningCue]);

    return (
        <div className='text-sm group flex items-center rounded-md transition duration-200 ease-in-out'        >
            {(props.warningCue) ?
                <Tooltip className="flex items-center justify-center mr-2" content="Warning: Potential invalid config!" color="invert">
                    <IconAlertTriangle className="h-4 w-4 text-orange-400" />
                </Tooltip> : null}
            <button
                onClick={handleButtonClick}
                className={buttonClasses}
                ref={props.innerRef}
                disabled={props.disabled}
                type='submit'
            >
                {props.loading ? (
                    <div className={combineClassNames(`inline-flex items-center justify-center text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`, sizeClasses)}>
                        <Loading size="sm" type="spinner" color="currentColor" />
                    </div>

                ) : confirm ? (
                    <IconCheck className={combineClassNames(`text-green-500 group-hover:text-green-600`,
                        sizeClasses)} />
                ) : (
                    <IconDeviceFloppy className={combineClassNames(`text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`,
                        sizeClasses)} />
                )
                }
                {props.text ? (
                    <Tooltip className={props.disabled ? "cursor-not-allowed" : undefined} color="invert" content={props.tooltip} placement={props.tooltipPlacement || "bottom"} >
                        <span className={`text-${props.buttonColor}-700 group-hover:text-${props.buttonColor}-800}`}>{props.text}</span>
                    </Tooltip>
                ) : null}
            </button>
        </div >
    )
}
