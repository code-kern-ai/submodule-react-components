import { SortKey } from "./sort";

export type KernTableProps = {
    headers: { column: string, id: string, hasSort?: boolean, hasCheckboxes?: boolean, checked?: boolean, onChange?: any }[];
    values?: any[];
    config?: {
        sortKey?: SortKey;
        onClickSort?: (property: string) => void;
    }
}