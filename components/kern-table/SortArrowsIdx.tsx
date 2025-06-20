import { SortArrowsPropsIdx } from '../../types/sort';
import { MemoIconArrowDown, MemoIconArrowsSort, MemoIconArrowUp } from '../kern-icons/icons';

export default function SortArrowsIdx(props: SortArrowsPropsIdx) {

    if (props.sortKey.idx != props.idx || (props.sortKey.idx == props.idx && props.sortKey.direction == 0))
        return <MemoIconArrowsSort className='text-gray-500 h-4 w-4' />

    if (props.sortKey.idx == props.idx && props.sortKey.direction == 1)
        return <MemoIconArrowUp className='text-gray-500 h-4 w-4' />

    return <MemoIconArrowDown className='text-gray-500 h-4 w-4' />
}