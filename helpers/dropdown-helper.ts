import { DropdownProps } from "../types/dropdown";

export const SELECT_ALL = 'Select all';

export function getTextArray(arr: string[] | any[]): string[] {
    if (!arr) return [];
    if (arr.length == 0) return [];
    if (typeof arr[0] == 'string') return arr as string[];
    if (typeof arr[0] == 'number') return arr.map(String);
    let valueArray = arr;
    if (arr[0].value && typeof arr[0].value == 'object') valueArray = arr.map(x => x.getRawValue());
    if (valueArray[0].name) return valueArray.map(a => a.name);
    if (valueArray[0].text) return valueArray.map(a => a.text);

    let firstStringKey = "";

    for (const key of Object.keys(valueArray[0])) {
        if (typeof valueArray[0][key] == 'string') {
            firstStringKey = key;
            break;
        }
    }
    if (!firstStringKey) throw new Error("Cant find text in given array - dropdown");
    return valueArray.map(a => a[firstStringKey]);
}

export function prepareDropdownOptionsToArray(options: string[] | any[], doNotUseTextArray: boolean) {
    if (!options) return [];
    if (options.length == 0) return [];
    if (doNotUseTextArray) return options.map(x => x.name)
    else return getTextArray(options);
}

export function setOptionsWithSearchBar(options: string[], searchText: string) {
    if (!searchText) return options;
    const filtered = options.filter(option =>
        option.toLowerCase().includes(searchText.toLowerCase())
    );
    return filtered;
}

export function checkDropdownProps(props: DropdownProps) {
    if (!props.options || props.options.length == 0) return;
    if (props.disabledOptions && (props.options.length != props.disabledOptions.length)) {
        throw new Error('Dropdown: options length must be equal to disabledOptions length');
    } else if (props.tooltipsArray && (props.options.length != props.tooltipsArray.length)) {
        throw new Error('Dropdown: options length must be equal to tooltipsArray length');
    } else if (props.selectedCheckboxes && (props.selectedCheckboxes.length != props.options.length)) {
        throw new Error('Dropdown: selectedCheckboxes length must be equal to options length');
    } else if (props.selectedCheckboxes && props.selectedCheckboxes.length > 0 && !props.hasCheckboxes) {
        throw new Error('Dropdown: selectedCheckboxes can only be used with hasCheckboxes');
    } else if (!props.hasCheckboxes && props.hasSelectAll) {
        throw new Error('Dropdown: hasSelectAll can only be used with hasCheckboxes');
    } else if (props.hasCheckboxes) {
        const compare = SELECT_ALL.trim().toLowerCase();
        const hasSelectAll = props.options.indexOf((option: any) => option.trim().toLowerCase() == compare) != -1;
        if (hasSelectAll && props.hasSelectAll) {
            throw new Error('Dropdown: "select all" is included twice');
        } else if (hasSelectAll && !props.hasSelectAll) {
            throw new Error('Dropdown: "select all" should be used with hasSelectAll');
        }
    }
}