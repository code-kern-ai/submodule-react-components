/**
 * Optionset for kern dropdown
 * @buttonName {string} - The name of the button
 * @options {string[] | any[]} - Can be any array of strings or objects
 * @selectedOption {function} - The function that will be called when an option is selected
 * @disabled {DropdownOptionsProps} - If the dropdown is disabled
 * @onlyArray {boolean} - If the dropdown has only an array of strings
 * @dropdownClasses {string} - The classes that will be applied to the dropdown
 * @dropdownWidth {string} - The width of the dropdown
 * @dropdownItemsClasses {string} - The classes that will be applied to the dropdown items
 * @dropdownItemsWidth {string} - The width of the dropdown items
 * @doNotUseTextArray {boolean} - If the dropdown should not use the text array
*/
export type DropdownProps = {
    buttonName: string;
    options?: string[] | any[];
    selectedOption?: (value: any) => void;
    disabled?: boolean;
    onlyArray?: boolean;
    dropdownClasses?: string;
    dropdownWidth?: string;
    dropdownItemsClasses?: string;
    dropdownItemsWidth?: string;
    doNotUseTextArray?: boolean;
}

export type AppSelectionDropdownProps = {
    cockpit?: boolean;
    refinery?: boolean;
    gates?: boolean;
    workflow?: boolean;
};