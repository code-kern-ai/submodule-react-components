import { combineClassNames } from "@/submodules/javascript-functions/general";
import { IconLoader2 } from "@tabler/icons-react";
import { Tooltip } from '@nextui-org/react'
import React, { useCallback, useMemo, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { MemoIconCheck, MemoIconLoader2 } from "../kern-icons/icons";

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
    asDiv?: boolean;
}

export default function KernButton(props: KernButtonProps) {

    const [confirm, setConfirm] = useState<boolean>(false);
    const onClick = useCallback((e) => {
        if (props.onClick) props.onClick(e);
        if (props.confirm) {
            setConfirm(true);
            setTimeout(() => setConfirm(false), 3000);
        }
    }, [props.onClick, props.confirm]);

    const buttonClasses = useMemo(() => {
        const classes = ['text-sm group flex gap-x-2 items-center rounded-md hover:shadow-sm transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'];
        if (props.className) classes.push(props.className);
        if (props.buttonColor) {
            if (props.solidTheme) {
                classes.push(`border border-${props.buttonColor}-600 bg-${props.buttonColor}-600 hover:bg-${props.buttonColor}-600 active:bg-${props.buttonColor}-600 active:border-${props.buttonColor}-600`);
            } else {
                classes.push(`border border-${props.buttonColor}-300 bg-${props.buttonColor}-50 hover:bg-${props.buttonColor}-100 hover:border-${props.buttonColor}-400 active:bg-${props.buttonColor}-200 active:border-${props.buttonColor}-500`);
            }
        } else {
            classes.push('border bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:border-gray-400');
        }
        classes.push(props.fullWidth ? 'w-full justify-center' : 'w-fit');
        classes.push(props.fullHeight ? 'h-full' : '');
        if (props.size == 'small') classes.push('px-1 p-0.5');
        else if (props.size == 'large') classes.push('px-3 py-1.5');
        else if (props.size == 'medium') classes.push('px-2 py-1');
        else if (props.size == 'solid-large') classes.push('px-3 py-2');
        else classes.push('px-2 py-1');
        return classes.join(' ');
    }, [props.className, props.buttonColor, props.solidTheme, props.fullWidth, props.fullHeight, props.size]);

    const iconSize = useMemo(() => {
        if (props.size == 'small') return 'w-4 h-4';
        if (props.size == 'large') return 'w-6 h-6';
        return 'w-5 h-5';
    }, [props.size]);

    const baseElementProps = {
        onClick: onClick,
        className: buttonClasses,
        ref: props.innerRef,
        disabled: props.disabled,
        type: props.type || 'submit'
    }

    const children = <Tooltip className={"flex gap-x-2 items-center " + (props.disabled ? "cursor-not-allowed" : "")} color="invert" content={props.tooltip} placement={props.tooltipPlacement || "bottom"} >
        {
            props.loading ? (
                <MemoIconLoader2 className={combineClassNames(
                    props.iconColor === "white" ? (
                        `animate-spin text-white group-hover:text-white`
                    ) : (
                        `animate-spin text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`
                    ),
                    iconSize)
                } />
            ) : props.icon ? (
                confirm ? (
                    <MemoIconCheck className={combineClassNames(`text-green-500 group-hover:text-green-600`,
                        iconSize)} />
                ) : (
                    <props.icon className={combineClassNames(
                        props.iconColor === "white" ? (
                            `text-white group-hover:text-white`
                        ) : (
                            `text-${props.iconColor}-500 group-hover:text-${props.iconColor}-600`
                        ),
                        iconSize)} />
                )
            ) : null}
        {props.text ? (
            <span className={combineClassNames(
                props.textColor ? (
                    `text-${props.textColor} group-hover:text-${props.textColor}`
                ) : (
                    `text-${props.buttonColor}-700 group-hover:text-${props.buttonColor}-800`
                )
            )}>{props.text}</span>
        ) : null}
    </Tooltip>


    return React.createElement(props.asDiv ? 'div' : 'button', baseElementProps, children)
}