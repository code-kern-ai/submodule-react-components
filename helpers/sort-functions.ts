import { SortDirection, SortKey } from "../types/sort";

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
    if (path.indexOf('.') == -1) return obj[path];
    const parts = path.split('.');
    let value = obj;
    for (let i = 0; i < parts.length; i++) {
        if (value[parts[i]] == null) return null;
        value = value[parts[i]];
    }
    return value;
}

export function sortString(a: string, b: string, order: SortDirection) {
    if (!a && a != '') return -1;
    if (!b && b != '') return 1;
    switch (order) {
        case SortDirection.ASC:
            return (a < b ? -1 : (a > b ? 1 : 0));
        case SortDirection.DESC:
            return (b < a ? -1 : (b > a ? 1 : 0));
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