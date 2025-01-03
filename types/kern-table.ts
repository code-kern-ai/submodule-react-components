import { SortKey } from "@/src/util/sort-functions";

export type KernTableProps = {
    headers: { column: string, id: string }[];
    values?: any[];
    config?: {
        sortKey?: SortKey;
        sortingColumns?: string[];
        onClickSort?: (property: string) => void;
    }
}