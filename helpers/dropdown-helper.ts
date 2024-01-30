import { DropdownProps } from "../types/dropdown";

export const SELECT_ALL = 'Select all';
export const COLOR_WITHOUT_NUMBER = ['kernindigo', 'black', 'white'];

export function getTextArray(arr: string[] | any[]): string[] {
    // console.log("getTextArray", arr)
    if (!arr) return [];
    if (arr.length == 0) return [];
    if (typeof arr[0] == 'string') return arr as string[];
    if (typeof arr[0] == 'number') return arr.map(String);
    let valueArray = arr;
    // if (arr[0].value && typeof arr[0].value == 'object') valueArray = arr.map(x => x.getRawValue());
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

export function prepareDropdownOptionsToArray(options: string[] | any[], hasSearchBar: boolean, valuePropertyPath?: string): string[] {
    if (!options) return [];
    if (options.length == 0) return [];
    if (valuePropertyPath) return options.map(x => x[valuePropertyPath]);
    if (hasSearchBar && !valuePropertyPath) return options as string[];
    else return getTextArray(options);
}

export function setOptionsWithSearchBar(options: string[], searchText: string) {
    if (!searchText) return options;
    return options.filter(option => option.toLowerCase().includes(searchText.toLowerCase()));
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
    } else if (props.backgroundColors && (props.backgroundColors.length != props.options.length)) {
        throw new Error('Dropdown: backgroundColors length must be equal to options length');
    } else if (props.useDifferentTextColor && props.useDifferentTextColor.length > 0 && (props.useDifferentTextColor.length != props.options.length)) {
        // throw new Error('Dropdown: useDifferentTextColor length must be equal to options length');
    } else if (props.useDifferentTextColor && !props.differentTextColor) {
        throw new Error('Dropdown: differentTextColor must be defined if useDifferentTextColor is provided');
    } else if (props.linkList && (props.linkList.length != props.options.length)) {
        throw new Error('Dropdown: linkList length must be equal to options length');
    } else if (props.linkList && !props.optionsHaveLink) {
        throw new Error('Dropdown: linkList should be used with optionsHaveLink');
    } else if (props.hoverBoxList && (props.hoverBoxList.length != props.options.length)) {
        // throw new Error('Dropdown: hoverBoxList length must be equal to options length');
    } else if (props.hoverBoxList && !props.optionsHaveHoverBox) {
        throw new Error('Dropdown: hoverBoxList should be used with optionsHaveHoverBox');
    } else if (props.iconsArray && (props.iconsArray.length != props.options.length)) {
        throw new Error('Dropdown: iconsArray length must be equal to options length');
    } else if (props.useFillForIcons && (props.useFillForIcons.length != props.options.length)) {
        throw new Error('Dropdown: useFillForIcons length must be equal to options length');
    }
}

export function reduceColorProperty(property: string, defaultShade: string): string {
    if (!property) return "";
    let splitted = property.split(":");
    if (splitted.length > 1) property = splitted[splitted.length - 1];

    splitted = property.split("-");
    if (['bg', 'text'].includes(splitted[0])) splitted = splitted.slice(1);

    if (splitted.length == 1) {
        if (COLOR_WITHOUT_NUMBER.includes(splitted[0])) return splitted[0] + " ";
        return splitted[0] + "-" + defaultShade;
    }
    return splitted.join("-");
}

export function getDropdownDisplayText(
    formControls: any[],
    labelFor: string
): string {
    let text = '';
    let atLeastOneNegated: boolean = false;
    for (let c of formControls) {
        const hasNegate = Boolean(c['negate']);
        if (labelFor == 'EMPTY' && c['active']) return '';
        else if (
            labelFor == 'NOT_NEGATED' &&
            c['active'] &&
            (!hasNegate || (hasNegate && !c['negate']))
        ) {
            text += (text == '' ? '' : ', ') + c['name'];
        } else if (
            labelFor == 'NEGATED' &&
            c['active'] &&
            hasNegate &&
            c['negate']
        ) {
            text += (text == '' ? '' : ', ') + c['name'];
        }
        if (
            !atLeastOneNegated &&
            c['active'] &&
            hasNegate &&
            c['negate']
        )
            atLeastOneNegated = true;
    }
    if (labelFor == 'EMPTY') return 'None Selected';

    if (labelFor == 'NOT_NEGATED' && atLeastOneNegated && text != '')
        return text + ', ';

    return text;
}

export function getActiveNegateGroupColor(group: any) {
    if (!group['active']) return null;
    if (group['negate']) {
        return group['negate'] ? '#ef4444' : '#2563eb';
    }
    return '#2563eb';

}