import { combineClassNames } from '@/submodules/javascript-functions/general';
import { PaginationProps } from '../../types/pagination'
import { MemoIconArrowLeft, MemoIconArrowRight } from '../kern-icons/icons';
import { useCallback, useEffect, useMemo } from 'react';

const PAGE_BTN_BASE = 'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium';
const PAGE_BTN_ACTIVE = `${PAGE_BTN_BASE} border-indigo-500 text-indigo-600`;
const PAGE_BTN_INACTIVE = `${PAGE_BTN_BASE} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`;
const ELLIPSIS_CLASS = `${PAGE_BTN_BASE} border-transparent text-gray-500`;
const NAV_BTN_BASE = 'inline-flex items-center border-t-2 border-transparent pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed';
const NAV_BTN_PREV = `${NAV_BTN_BASE} pr-1`;
const NAV_BTN_NEXT = `${NAV_BTN_BASE} pl-1`;

export default function Pagination(props: PaginationProps) {
    const totalPages = useMemo(() =>
        Math.ceil(props.fullCount / props.limit),
        [props.fullCount, props.limit]
    );

    const currentPage = useMemo(() => {
        if (!totalPages) return 1;
        return Math.min(Math.floor(props.offset / props.limit) + 1, totalPages);
    }, [props.offset, props.limit, totalPages]);

    useEffect(() => {
        if (!totalPages) return;
        const maxOffset = (totalPages - 1) * props.limit;
        if (props.offset > maxOffset) props.setOffset(maxOffset);
    }, [props.offset, props.limit, props.setOffset, totalPages]);

    const handlePrevious = useCallback(() => {
        props.setOffset(Math.max(props.offset - props.limit, 0));
    }, [props.offset, props.limit, props.setOffset]);

    const handleNext = useCallback(() => {
        props.setOffset(Math.min(props.offset + props.limit, (totalPages - 1) * props.limit));
    }, [props.offset, props.limit, props.setOffset, totalPages]);

    const pageButtons = useMemo(() => {
        const ellipsis = (key: string) => (
            <span key={key} className={ELLIPSIS_CLASS}>...</span>
        );

        const pageButton = (page: number) => (
            <button
                key={page}
                onClick={() => props.setOffset((page - 1) * props.limit)}
                className={currentPage === page ? PAGE_BTN_ACTIVE : PAGE_BTN_INACTIVE}
            >
                {page}
            </button>
        );

        // Show all pages when reducePageNumbers is off or total is small
        if (!props.reducePageNumbers || totalPages <= 10) {
            return Array.from({ length: totalPages }, (_, i) => pageButton(i + 1));
        }

        // Middle position: 1 ... (current-1, current, current+1) ... last
        if (currentPage > 3 && currentPage < totalPages - 2) {
            return [
                pageButton(1),
                ellipsis('start'),
                pageButton(currentPage - 1),
                pageButton(currentPage),
                pageButton(currentPage + 1),
                ellipsis('end'),
                pageButton(totalPages)
            ];
        }

        // Near start or end: first 3 ... last 3
        return [
            pageButton(1),
            pageButton(2),
            pageButton(3),
            ellipsis('middle'),
            pageButton(totalPages - 2),
            pageButton(totalPages - 1),
            pageButton(totalPages)
        ];
    }, [totalPages, currentPage, props.reducePageNumbers, props.limit, props.setOffset]);

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || !totalPages}
                    className={NAV_BTN_PREV}
                >
                    <MemoIconArrowLeft className={combineClassNames("h-5 w-5 text-gray-400", props.previousLabel ? "mr-3" : "")} />
                    {props.previousLabel}
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {pageButtons}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || !totalPages}
                    className={NAV_BTN_NEXT}
                >
                    {props.nextLabel}
                    <MemoIconArrowRight className={combineClassNames("h-5 w-5 text-gray-400", props.nextLabel ? "ml-3" : "")} aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}
