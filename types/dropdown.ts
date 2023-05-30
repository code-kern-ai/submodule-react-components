export type DropdownProps = {
    options: any[];
    buttonName: string;
    disabled?: boolean;
    selectedOption: (event: any) => void;
    itemsClasses?: string;
    hasIconClock?: boolean;
    onlyArray?: boolean;
    dropdownWidth?: string;
}
