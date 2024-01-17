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
 * @hasSearchBar {boolean} - If the dropdown has a search bar
 * @onSearchChange {function} - The function that will be called when the search bar value changes
 * @searchDefaultValue {string} - The default value of the search bar
 * @hasCheckboxes {boolean} - If the dropdown has checkboxes
 * @selectedCheckboxes {boolean[]} - The array of selected checkboxes (needs to be the exact same length as the optionArray)
 * @addSelectAllOption {boolean} - Adds a select all option to the dropdown if true
 * @backgroundColors {string[]} - The array of background colors that will be applied to the dropdown items (needs to be the exact same length as the optionArray)
 * @keepDrownOpen {boolean} - If the dropdown should stay open after an option is selected
 * @useDifferentTextColor {boolean[]} - If the dropdown should use a different text color for each option (needs to be the exact same length as the optionArray)
 * @differentTextColor {string} - The color that will be applied to the text of the dropdown items if useDifferentTextColor is true
 * @buttonCaptionBgColor {string} - The color that will be applied to the button caption
 * @onClickDelete {function} - The function that will be called when the delete button is clicked (delete button will only be rendered if the function is provided)
 * @hasCheckboxesThreeStates {boolean} - If the dropdown has checkboxes with three states
 * @fontClass {string} - The font class that will be applied to the dropdown items
 * @optionsHaveLink {boolean} - If the dropdown options have a link
 * @linkList {string[]} - The array of links that will be applied to the dropdown items (needs to be the exact same length as the optionArray)
 * @optionsHaveHoverBox {boolean} - If the dropdown options have a hover box
 * @hoverBoxList {string[]} - The array of hover boxes that will be applied to the dropdown items (needs to be the exact same length as the optionArray)
 * @addLineSeparator {boolean} - If the dropdown should have a line separator
 * @lineSeparatorIndex {number} - The index of the dropdown item that will have a line separator
 * @iconsArray {string[]} - The array of icons that will be applied to the dropdown items (needs to be the exact same length as the optionArray)
 * @valuePropertyPath {string, optional} - if undefined option text is returned, else (e.g. name.tmp.xyz) the path is split and used to access the object property
 * @useFillForIcons {boolean[], optional} - if true, the icon will be filled with the color of the option
 * @searchTextTyped {function} - returns the text typed in the search bar
*/
export type DropdownProps = {
    buttonName?: string;
    options?: any;
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
    tooltipArrayPlacement?: "bottom" | "left" | "right" | "top" | "topStart" | "topEnd" | "leftStart" | "leftEnd" | "bottomStart" | "bottomEnd" | "rightStart" | "rightEnd";
    hasSearchBar?: boolean;
    onSearchChange?: (value: string) => void;
    searchDefaultValue?: string;
    hasCheckboxes?: boolean;
    selectedCheckboxes?: boolean[];
    hasSelectAll?: boolean;
    addSelectAllOption?: boolean;
    hasButtonDots?: boolean;
    backgroundColors?: string[];
    keepDrownOpen?: boolean;
    useDifferentTextColor?: boolean[];
    differentTextColor?: string;
    buttonCaptionBgColor?: string;
    onClickDelete?: (value: any) => void;
    hasCheckboxesThreeStates?: boolean;
    fontClass?: string;
    optionsHaveLink?: boolean;
    linkList?: string[];
    optionsHaveHoverBox?: boolean;
    hoverBoxList?: string[];
    addLineSeparator?: boolean;
    lineSeparatorIndex?: number;
    iconsArray?: string[];
    valuePropertyPath?: string;
    useFillForIcons?: boolean[];
    searchTextTyped?: (value: string) => void;
}

export type AppSelectionDropdownProps = {
    cockpit?: boolean;
    refinery?: boolean;
    gates?: boolean;
    workflow?: boolean;
};