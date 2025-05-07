import { combineClassNames } from "@/submodules/javascript-functions/general";
import { useMemo } from "react";

export type ButtonAsTextProps = {
    text: string;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
    iconLeft?: (props: any) => any;
    iconRight?: (props: any) => any;
    iconColor?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function ButtonAsText(props: ButtonAsTextProps) {
    const classCombined = useMemo(() => combineClassNames(
        'disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1',
        props.className,
        props.color ? (
            `text-${props.color}-600 hover:text-${props.color}-900`
        ) : (
            'text-gray-600 hover:text-gray-900'
        )
    ), [props.color]);

    return (
        <button
            className={classCombined}
            disabled={props.disabled}
            onClick={props.onClick}>
            {props.iconLeft && <props.iconLeft className={combineClassNames(
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
            )} />}
            <span>
                {props.text}
            </span>
            <span className="sr-only">,{props.text}</span>
            {props.iconRight && <props.iconRight className={combineClassNames(
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
            )} />}
        </button >)
}