export function getButtonColorClasses(buttonColor?: string) {
    return buttonColor
        ? `hover:bg-${buttonColor}-50 border border-${buttonColor}-300 bg-${buttonColor}-50 active:bg-${buttonColor}-200 active:border-${buttonColor}-500`
        : 'bg-white active:border-gray-400 border bg-white border-gray-200 hover:border-gray-300 active:bg-gray-100 active:border-gray-400';
};

export const buttonWarningColorClasses = "border-orange-200 hover:border-orange-300 active:bg-orange-100 active:border-orange-400";

export function getDisabledClasses(disabled?: boolean) {
    return disabled ? 'cursor-not-allowed bg-gray-200 opacity-50' : 'cursor-pointer';
};

export function getWidthClasses(fullWidth?: boolean) {
    return fullWidth ? 'w-full justify-center' : 'w-fit';
};

export function getHeightClasses(fullHeight?: boolean) {
    return fullHeight ? 'h-full' : '';
};

export function getSizeClasses(size?: string) {
    switch (size) {
        case 'small':
            return 'w-4 h-4';
        case 'large':
            return 'w-6 h-6';
        default:
            return 'w-5 h-5';
    }
};