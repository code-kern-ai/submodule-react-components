import { SortArrowsProps } from '../../types/sort';
import { MemoIconArrowDown, MemoIconArrowsSort, MemoIconArrowUp } from '../kern-icons/icons';

export default function SortArrows(props: SortArrowsProps) {
    return (
        props.sortKey.attributeName != props.property || (props.sortKey.attributeName == props.property && props.sortKey.direction == 0) ? (
            <MemoIconArrowsSort
                className='text-gray-500 h-4 w-4' />

        ) : (
            props.sortKey.attributeName == props.property && props.sortKey.direction == 1 ? (
                <MemoIconArrowUp
                    className='text-gray-500 h-4 w-4' />
            ) : (
                <MemoIconArrowDown
                    className='text-gray-500 h-4 w-4' />
            )
        )
    );
}