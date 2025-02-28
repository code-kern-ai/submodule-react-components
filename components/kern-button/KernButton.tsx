import { combineClassNames } from "@/submodules/javascript-functions/general";
import { IconLoader2 } from "@tabler/icons-react";
import { Tooltip } from '@nextui-org/react'
import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";

interface KernButtonProps {
    text?: string;
    type?: 'button' | 'submit' | 'reset';
    icon?: (props: any) => React.ReactNode;
    iconColor?: string;
    onClick?: (event?) => void;
    buttonColor?: string;
    textColor?: string;
    solidTheme?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    innerRef?: any;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large' | 'solid-large';
    tooltip?: string;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    confirm?: boolean;
    className?: string;
}

export default function KernButton(props: KernButtonProps) {

    const [confirm, setConfirm] = useState<boolean>(false);

    return (
        <button
            onClick={(e) => {
                if (props.onClick) {
                    props.onClick(e);
                }
                if (props.confirm) {
                    setConfirm(true);
                    setTimeout(() => {
                        setConfirm(false);
                    }, 3000);
                }
            }}
            className={
                combineClassNames(
                    'text-sm group flex gap-x-2 items-center rounded-md hover:shadow-sm transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
                    props.className,
                    props.buttonColor ? (
                        props.solidTheme ? (
                            `border border-${props.buttonColor}-600 bg-${props.buttonColor}-600 hover:bg-${props.buttonColor}-600 active:bg-${props.buttonColor}-600 active:border-${props.buttonColor}-600`
                        ) : (
                            `border border-${props.buttonColor}-300 bg-${props.buttonColor}-50 hover:bg-${props.buttonColor}-100 hover:border-${props.buttonColor}-400 active:bg-${props.buttonColor}-200 active:border-${props.buttonColor}-500`
                        )
                    ) : (
                        'border bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:border-gray-400'
                    ),
                    props.fullWidth ? (
                        'w-full justify-center'
                    ) : (
                        'w-fit'
                    ),
                    props.fullHeight ? (
                        'h-full'
                    ) : (
                        ''
                    ),
                    props.size == 'small' ? (
                        'px-1 p-0.5'
                    ) : props.size == 'large' ? (
                        'px-3 py-1.5'
                    ) : props.size == 'medium' ? (
                        'px-2 py-1'
                    ) : props.size == 'solid-large' ? (
                        'px-3 py-2'
                    ) : (
                        'px-2 py-1'
                    )
                )
            }
            ref={props.innerRef}
            disabled={props.disabled}
            type={props.type || 'submit'}
        >
            {props.loading ? (
                <IconLoader2 className={combineClassNames(
                    props.iconColor === "white" ? (
                        `animate-spin text-white group-hover:text-white`
                    ) : (
                        `animate-spin text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`
                    ),
                    props.size == 'small' ? (
                        'w-4 h-4'
                    ) : (
                        props.size == 'large' ? (
                            'w-6 h-6'
                        ) : (
                            'w-5 h-5'
                        )
                    ))
                } />
            ) : props.icon ? (
                confirm ? (
                    <IconCheck className={combineClassNames(`text-green-500 group-hover:text-green-600`,
                        props.size == 'small' ? (
                            'w-4 h-4'
                        ) : (
                            props.size == 'large' ? (
                                'w-6 h-6'
                            ) : (
                                'w-5 h-5'
                            )
                        ))} />
                ) : (
                    <props.icon className={combineClassNames(
                        props.iconColor === "white" ? (
                            `text-white group-hover:text-white`
                        ) : (
                            `text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`
                        ),
                        props.size == 'small' ? (
                            'w-4 h-4'
                        ) : (
                            props.size == 'large' ? (
                                'w-6 h-6'
                            ) : (
                                'w-5 h-5'
                            )
                        ))} />
                )
            ) : null}
            {props.text ? (
                <Tooltip className={props.disabled ? "cursor-not-allowed" : undefined} color="invert" content={props.tooltip} placement={props.tooltipPlacement || "bottom"} >
                    <span className={combineClassNames(
                        props.textColor ? (
                            `text-${props.textColor} group-hover:text-${props.textColor}`
                        ) : (
                            `text-${props.buttonColor}-700 group-hover:text-${props.buttonColor}-800`
                        )
                    )}>{props.text}</span>
                </Tooltip>
            ) : null}
        </button>
    )
}