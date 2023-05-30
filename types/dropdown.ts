export type DropdownProps = {
    options: any[];
    buttonName: string;
    disabled?: boolean;
    selectedOption: (event: any) => void;
    itemsClasses?: string;
    hasIconClock?: boolean;
}

export type OptionProps = {
    name: string;
    id: string;
}
