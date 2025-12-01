import { PaginationProps } from '../../types/pagination'
import { MemoIconArrowLeft, MemoIconArrowRight } from '../kern-icons/icons';
import { useEffect, useMemo, useState } from 'react';


export default function Pagination(props: PaginationProps) {

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useMemo(() => {
        setCurrentPage(props.offset / props.limit + 1);
    }, [props.offset, props.limit]);

    useMemo(() => {
        setTotalPages(Math.ceil(props.fullCount / props.limit));
    }, [props.fullCount, props.limit]);

    useEffect(() => {
        props.setOffset((currentPage - 1) * props.limit);
    }, [currentPage, props.limit]);

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || !totalPages}
                    className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <MemoIconArrowLeft className="mr-3 h-5 w-5 text-gray-400" />
                    {props.previousLabel}
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${currentPage === page ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                        {page}
                    </button>
                ))}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || !totalPages}
                    className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {props.nextLabel}
                    <MemoIconArrowRight className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>
        </nav>
    )
}
