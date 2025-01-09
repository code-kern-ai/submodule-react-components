import { BadgeProps } from "../../../src/types/shared-components-types";

export function KernBadge(props: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${props.bgColor} ${props.textColor} ${props.border ? "border" : ""}`}
        >
            <svg
                className={`mr-1.5 h-2 w-2 ${props.svgColor}`}
                fill="currentColor"
                viewBox="0 0 8 8"
            >
                <circle cx="4" cy="4" r="3" />
            </svg>
            {props.name}
        </span>
    );
}

export function ActiveBadge() {
    return (
        <KernBadge
            name="Yes"
            bgColor="bg-green-100"
            textColor="text-green-800"
            svgColor="text-green-400"
        />
    );
}

export function InactiveBadge() {
    return (
        <KernBadge
            name="No"
            bgColor="bg-red-100"
            textColor="text-red-800"
            svgColor="text-red-400"
        />
    );
}

export function NotApplicableBadge() {
    return (
        <KernBadge
            name="n/a"
            bgColor="bg-gray-100"
            textColor="text-gray-800"
            svgColor="text-gray-400"
            border={true}
        />
    );
}