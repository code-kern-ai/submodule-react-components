export type KernButtonProps = {
    buttonName: string;
    onClick?: (event: any) => void;
    className?: string;
    icon?: any;
    disabled?: boolean;
    buttonType?: 'button' | 'submit' | 'reset';
}

export type ButtonProps = {
    onClick?: (event?: any) => void;
    disabled?: boolean;
}