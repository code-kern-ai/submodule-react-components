/**
 * Optionset for kern dropdown
 * @options {string[] | any[]} - Can be any array of strings or objects
 * @buttonCaption {string} - The name of the button
 * @selectedOption {function} - The function that will be called when an option is selected
 * @disabled {DropdownOptionsProps} - If the dropdown is disabled
 * @itemsClasses {string} - The classes that will be applied to the dropdown items
 * @hasIconClock {boolean} - If the dropdown has a clock icon
 * @onlyArray {boolean} - If the dropdown has only an array of strings
 * @dropdownWidth {string} - The width of the dropdown
*/
export type DropdownProps = {
    options: string[] | any[];
    buttonName: string;
    selectedOption: (event: any) => void;
    disabled?: boolean;
    itemsClasses?: string;
    hasIconClock?: boolean;
    onlyArray?: boolean;
    dropdownWidth?: string;
}

export type LayoutDropdownProps = {
    visibility: boolean[];
};