
import { CompareOptions } from "@/submodules/javascript-functions/validations";

/**
 * Options for the LocalStorage Dropdown component
 * Note that a ref object can be linked to the component
 * @buttonName {string} - The name of the button
 * @storageKey {string} - The key inside the storage group
 * @storageGroupKey {string, optional} - The key of the local storage value (defaults to localDropdown)
 * @onOptionSelected {function, optional} - The function that will be called when an option is selected
 * @searchDefaultValue {string, optional} - The default value of the search bar (similar to buttonName)
 * @excludedFromStorage {object, optional} - Decided what values are exempt from being added to the storage - defaults to "starting with 'select' or 'enter'"
*/

export type LocalStorageDropdownProps = {
    buttonName: string;
    storageKey: string;
    storageGroupKey?: string; //defaults to localDropdown
    onOptionSelected?: (option: string) => void;
    searchDefaultValue?: string;
    excludedFromStorage?: { values: string[]; compareOptions?: CompareOptions[] }; // if the value is in this list it will not be added to the storage //setting this to null will assume all values are valid
}



export const LOCAL_STORAGE_DROPDOWN_DEFAULTS = {
    storageGroupKey: "localDropdown",
    excludedFromStorage: { values: ["select", "enter"], compareOptions: [CompareOptions.IGNORE_CASE, CompareOptions.TRIM, CompareOptions.STARTS_WITH] }
}