import { combineClassNames } from "@/submodules/javascript-functions/general";
import { Tooltip } from '@nextui-org/react'
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

interface IconButtonProps {
    icon: (props: any) => React.ReactNode;
    iconColor?: string;
    onClick?: (e?: any) => void;
    buttonColor?: string;
    disabled?: boolean;
    keepOpacity?: boolean;
    size?: 'small' | 'medium' | 'large';
    tooltip?: string;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    confirm?: boolean;
    onMouseDown?: (e?: any) => void;
}

function InnerButton(props: IconButtonProps) {
    const [confirmed, setConfirmed] = useState<boolean>(false);

    return (
        <button
            onClick={(e?: any) => {
                if (props.onClick) props.onClick(e);
                if (props.confirm) {
                    setConfirmed(true);
                    setTimeout(() => {
                        setConfirmed(false);
                    }, 3000);
                }
            }}
            onMouseDown={props.onMouseDown ? props.onMouseDown : undefined}
            className={
                combineClassNames(
                    'text-sm group flex items-center justify-center rounded-md h-fit hover:shadow-sm transition duration-200 ease-in-out disabled:cursor-not-allowed',
                    props.keepOpacity ? '' : (
                        'disabled:opacity-50 '
                    ),
                    props.buttonColor ? (
                        `border border-${props.buttonColor}-300 bg-${props.buttonColor}-50 hover:bg-${props.buttonColor}-100 hover:border-${props.buttonColor}-400 active:bg-${props.buttonColor}-200 active:border-${props.buttonColor}-500`
                    ) : (
                        'border bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:border-gray-400'
                    ),
                    props.size == 'small' ? (
                        'p-1'
                    ) : (
                        props.size == 'large' ? (
                            'p-2'
                        ) : (
                            'p-1.5'
                        )
                    )
                )
            }
            disabled={props.disabled}
        >
            {confirmed ? (
                <IconCheck
                    className={combineClassNames(
                        `text-green-500 group-hover:text-green-600`,
                        props.size == 'small' ? (
                            'w-4 h-4'
                        ) : (
                            props.size == 'large' ? (
                                'w-6 h-6'
                            ) : (
                                'w-5 h-5'
                            )
                        )
                    )}
                />
            ) : (
                <props.icon className={combineClassNames(
                    `text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`,
                    props.size == 'small' ? (
                        'w-4 h-4'
                    ) : (
                        props.size == 'large' ? (
                            'w-6 h-6'
                        ) : (
                            'w-5 h-5'
                        )
                    )
                )} />
            )}

        </button>
    )
}

export default function IconButton(props: IconButtonProps) {
    return props.disabled ? (
        <InnerButton {...props} />
    ) : (
        <Tooltip color="invert" content={props.tooltip} placement={props.tooltipPlacement || "bottom"} >
            <InnerButton {...props} />
        </Tooltip>
    )
}