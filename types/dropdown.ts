export type DropdownProps = {
    options: OptionProps[];
    buttonName: string;
    disabled?: boolean;
    selectedOption: (event: any) => void;
}

export type OptionProps = {
    name: string;
    id: string;
}
