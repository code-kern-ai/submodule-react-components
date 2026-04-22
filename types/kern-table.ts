import { PaginationProps } from "./pagination";
import { SortKey, SortKeyIdx } from "./sort";

export type KernTableProps = {
    headers: { column: string, id: string, hasSort?: boolean, hasCheckboxes?: boolean, checked?: boolean, onChange?: any, tooltip?: string, wrapWhitespace?: boolean }[];
    values?: any[];
    config?: {
        sortKey?: SortKey;
        sortKeyIdx?: SortKeyIdx;
        onClickSort?: (property: string) => void;
        onClickSortIdx?: (idx: number) => void;
        addBorder?: boolean;
        noEntriesText?: string;
        specificDesign?: boolean;
    };
    /** When set, renders {@link Pagination} below the table (e.g. server-driven paging). */
    pagination?: PaginationProps;
}