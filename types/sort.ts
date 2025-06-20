export type SortArrowsProps = {
    sortKey: SortKey;
    property: string;
};
export type SortArrowsPropsIdx = {
    sortKey: SortKeyIdx;
    idx: number;
};


export type SortKey = {
    attributeName: string;
    dataType: string;
    direction: SortDirection;
};

export type SortKeyIdx = {
    idx: number;
    dataType: string;
    direction: SortDirection;
};

export enum SortDirection {
    ASC = 1,
    DESC = -1,
    NO_SORT = 0
};