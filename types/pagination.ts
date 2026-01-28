export type PaginationProps = {
    offset: number;
    setOffset: (offset: number) => void;
    fullCount: number;
    limit: number;
    previousLabel?: string;
    nextLabel?: string;
    reducePageNumbers?: boolean;
}