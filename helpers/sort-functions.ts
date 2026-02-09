import { safeAccess } from "./general-helper";
import { SortDirection, SortKey, SortKeyIdx } from "../types/sort";


//keeping some older methods to prevent breaking cognition
export function sortArrayByProperty(arr: any[], property: string, sortKey: SortKey, usersTable: boolean = false) {
    if (!arr || arr.length == 0) return sortKey;
    let order = nextSortDirection(property, sortKey);
    const isDate = arr[0][property] instanceof Date;
    sortKey = {
        attributeName: property,
        dataType: isDate ? 'date' : typeof getPropertyValue(arr[0], property),
        direction: order
    };
    if (!usersTable) {
        sortBySortKey(arr, sortKey);
    }
    return sortKey;
}

export function nextSortDirection(property: string, sortKey: SortKey): SortDirection {
    let order = SortDirection.ASC;
    if (sortKey && sortKey.attributeName == property) {
        if (sortKey.direction == SortDirection.ASC) {
            order = SortDirection.DESC;
        }
        else if (sortKey.direction == SortDirection.DESC) {
            order = SortDirection.NO_SORT;
        }
        else if (sortKey.direction == SortDirection.NO_SORT) {
            order = SortDirection.ASC;
        }
    }
    return order;
}


export function sortBySortKey(arr: any[], sortKey: SortKey) {
    if (!sortKey) return;
    const order = sortKey.direction;
    const property = sortKey.attributeName;
    switch (sortKey.dataType) {
        case 'string':
            arr.sort((a, b) => sortString(getPropertyValue(a, property), getPropertyValue(b, property), order));
            break;
        case 'number':
            arr.sort((a, b) => sortNumber(getPropertyValue(a, property), getPropertyValue(b, property), order));
            break;
        case 'date':
            arr.sort((a, b) => sortDate(getPropertyValue(a, property), getPropertyValue(b, property), order));
            break;
        case 'boolean':
            arr.sort((a, b) => sortBoolean(getPropertyValue(a, property), getPropertyValue(b, property), order));
            break;
        default:
            arr.sort((a, b) => sortString(getPropertyValue(a, property), getPropertyValue(b, property), order));
            break;
    }
}

export function getPropertyValue(obj: any, path: string) {
    if (!obj || !path) return null;
    if (path.indexOf('.') == -1) return safeAccess(obj, path);
    const parts = path.split('.');
    let value = obj;
    for (let i = 0; i < parts.length; i++) {
        if (safeAccess(value, parts[i]) == null) return null;
        value = safeAccess(value, parts[i]);
    }
    return value;
}

export function sortPreppedArrayByIdx(arr: any[][], idx: number, sortKey: SortKeyIdx) {
    if (!arr || arr.length == 0) return sortKey;

    let dataType = arr[0][idx].type;
    if (dataType == 'Component' || dataType == 'dropdown') {
        if (!("value" in arr[0][idx])) throw new Error("No value found for idx: " + idx);
        let firstValue = arr[0][idx].value;
        if (Array.isArray(firstValue)) firstValue = firstValue[0];
        if (firstValue instanceof Date) dataType = 'date';
        else dataType = typeof firstValue;
    }
    sortKey = {
        idx: idx,
        dataType: dataType,
        direction: nextSortDirectionByIdx(idx, sortKey)
    };
    sortBySortKeyIdx(arr, sortKey);
    return sortKey;
}

export function nextSortDirectionByIdx(idx: number, sortKey: SortKeyIdx): SortDirection {
    if (sortKey && sortKey.idx == idx) {
        if (sortKey.direction == SortDirection.ASC) return SortDirection.DESC;
        else if (sortKey.direction == SortDirection.DESC) return SortDirection.NO_SORT;
        else if (sortKey.direction == SortDirection.NO_SORT) return SortDirection.ASC;
    }
    return SortDirection.ASC;
}


export function sortBySortKeyIdx(arr: any[], sortKey: SortKeyIdx) {
    if (!sortKey) return;
    const order = sortKey.direction;
    switch (sortKey.dataType) {
        case 'string':
            arr.sort((a, b) => sortString(a[sortKey.idx].value, b[sortKey.idx].value, order));
            break;
        case 'number':
            arr.sort((a, b) => sortNumber(a[sortKey.idx].value[0], b[sortKey.idx].value[0], order));
            break;
        case 'date':
        case 'dateInput':
            arr.sort((a, b) => sortDate(a[sortKey.idx].value[0], b[sortKey.idx].value[0], order));
            break;
        case 'boolean':
            arr.sort((a, b) => sortBoolean(a[sortKey.idx].value, b[sortKey.idx].value, order));
            break;
        default:
            arr.sort((a, b) => sortString(a[sortKey.idx].value, b[sortKey.idx].value, order));
            break;
    }
}


export function sortString(a: string, b: string, order: SortDirection) {
    if (!a && a != '') return -1;
    if (!b && b != '') return 1;
    switch (order) {
        case SortDirection.ASC:
            return a.localeCompare(b);
        case SortDirection.DESC:
            return a.localeCompare(b) * -1;
        case SortDirection.NO_SORT:
            return 0;
    }
}

export function sortNumber(a: number, b: number, order: SortDirection) {
    if (!a && a != 0) return -1;
    if (!b && b != 0) return 1;
    switch (order) {
        case SortDirection.ASC:
            return a - b;
        case SortDirection.DESC:
            return b - a;
        case SortDirection.NO_SORT:
            return 0;
    }
}

export function sortDate(a: Date, b: Date, order: SortDirection) {
    if (!a) return -1;
    if (!b) return 1;
    switch (order) {
        case SortDirection.ASC:
            return a.getTime() - b.getTime();
        case SortDirection.DESC:
            return b.getTime() - a.getTime();
        case SortDirection.NO_SORT:
            return 0;
    }
}

export function sortBoolean(a: boolean, b: boolean, order: SortDirection) {
    if (a == b) return 0;
    switch (order) {
        case SortDirection.ASC:
            return a ? 1 : -1;
        case SortDirection.DESC:
            return a ? -1 : 1;
        case SortDirection.NO_SORT:
            return 0;
    }
}