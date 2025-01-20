import { IconArrowDown, IconArrowUp, IconArrowsSort } from '@tabler/icons-react';
import { SortArrowsProps } from '../../types/sort';

export default function SortArrows(props: SortArrowsProps) {
    return (
        props.sortKey.attributeName != props.property || (props.sortKey.attributeName == props.property && props.sortKey.direction == 0) ? (
            <IconArrowsSort
                className='text-gray-500 h-4 w-4' />

        ) : (
            props.sortKey.attributeName == props.property && props.sortKey.direction == 1 ? (
                <IconArrowUp
                    className='text-gray-500 h-4 w-4' />
            ) : (
                <IconArrowDown
                    className='text-gray-500 h-4 w-4' />
            )
        )
    );
}