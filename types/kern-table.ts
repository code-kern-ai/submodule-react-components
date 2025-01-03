import { SortKey } from "@/src/util/sort-functions";

export type KernTableProps = {
    headers: { column: string, id: string, hasSort?: boolean }[];
    values?: any[];
    config?: {
        sortKey?: SortKey;
        onClickSort?: (property: string) => void;
    }
}