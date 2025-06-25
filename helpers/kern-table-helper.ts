import { dateAsUTCDate, parseUTC } from "@/submodules/javascript-functions/date-parser";


//edit function can be added to any column automatically adding an icon to the column if it exists (e.g. org table admin-dashboard)
export function extendEditFunction(column: any, editFunction: () => void) {
    return {
        ...column,
        editFunction: editFunction
    }
}

export function toTableColumnText(value: string) {
    return {
        type: "text",
        value: value
    }
}

export function toTableColumnNumber(value: number) {
    return {
        type: "number",
        value: [value, value == null ? null : "" + value]
    }
}

export function toTableColumnCheckbox(value: boolean, valueChange?: () => void) {
    return {
        type: "boolean",
        value: value,
        checked: value,
        valueChange: valueChange
    }
}

export function toTableColumnComponent(component: string, sortValue: any, props?: any) {
    const base = {
        type: 'Component',
        component: component,
        value: sortValue
    }
    //sorting checks on value type & expects an array for date and number types
    if (base.value instanceof Date || typeof base.value == 'number') base.value = [base.value]
    if (!props) return base;

    return {
        ...base,
        ...props
    }
}

export function toTableColumnDate(value: string, onlyDate?: boolean) {
    return {
        type: 'date',
        value: [dateAsUTCDate(new Date(value || null)), parseUTC(value, onlyDate)]
    }
}

export function toTableColumnInputDate(value: string, valueChange: (event) => void) {
    return {
        type: 'dateInput',
        value: [dateAsUTCDate(new Date(value || null)), value || ''],
        valueChange: valueChange
    }
}

export function toTableColumnDropdown(value: string, options: any[], selectedOption?: (option: any) => void, disabled?: boolean) {
    return {
        type: 'dropdown',
        value: value,
        options: options,
        selectedOption: selectedOption,
        disabled: disabled
    }
}