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
 * @disabledOptions {boolean[], optional} - disables the dropdown option (needs to be the exact same length as the optionArray)
 * @buttonClasses {string} - The classes that will be applied to the button
 * @tooltipsArray {string[]} - The array of tooltips that will be applied to the dropdown items (needs to be the exact same length as the optionArray)
 * @tooltipArrayPlacement {string} - The placement of the tooltips in the dropdown items
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
    disabledOptions?: boolean[];
    buttonClasses?: string;
    tooltipsArray?: string[];
    tooltipArrayPlacement?: "bottom" | "left" | "right" | "top" | "topStart" | "topEnd" | "leftStart" | "leftEnd" | "bottomStart" | "bottomEnd" | "rightStart" | "rightEnd"
}

export type AppSelectionDropdownProps = {
    cockpit?: boolean;
    refinery?: boolean;
    gates?: boolean;
    workflow?: boolean;
};