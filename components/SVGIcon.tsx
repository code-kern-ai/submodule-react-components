import { IconBolt, IconChevronDown, IconCode, IconDotsVertical, IconEdit, IconExternalLink, IconFileInfo, IconFilePencil, IconLoader, IconPlayerPlayFilled, IconShieldCheckFilled, IconShieldFilled, IconSquare, IconSquareCheck, IconTrash } from '@tabler/icons-react';
import { MemoIconBolt, MemoIconChevronDown, MemoIconCode, MemoIconDotsVertical, MemoIconEdit, MemoIconExternalLink, MemoIconFileInfo, MemoIconFilePencil, MemoIconLoader, MemoIconPlayerPlayFilled, MemoIconShieldCheckFilled, MemoIconShieldFilled, MemoIconSquare, MemoIconSquareCheck, MemoIconTrash } from './kern-icons/icons';

export const SUPPORTED_ICONS = ['IconCode', 'IconBolt', 'IconSquareCheck', 'IconSquare', 'IconPlayerPlayFilled', 'IconTrash', 'IconExternalLink',
    'IconLoader', 'IconFilePencil', 'IconFileInfo', 'IconEdit', 'IconShieldFilled', 'IconShieldCheckFilled'
]

type SVGIconProps = {
    icon: string,
    size?: number,
    strokeWidth?: number,
    useFillForIcons?: boolean
}

export default function SVGIcon(props: SVGIconProps) {
    switch (props.icon) {
        case 'IconCode':
            return <MemoIconCode size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconBolt':
            return <MemoIconBolt size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconSquareCheck':
            return <MemoIconSquareCheck size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconSquare':
            return <MemoIconSquare size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconPlayerPlayFilled':
            return <MemoIconPlayerPlayFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconTrash':
            return <MemoIconTrash size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconExternalLink':
            return <MemoIconExternalLink size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconChevronDown':
            return <MemoIconChevronDown size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconDotsVertical':
            return <MemoIconDotsVertical size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconLoader':
            return <MemoIconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconFilePencil':
            return <MemoIconFilePencil size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconFileInfo':
            return <MemoIconFileInfo size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconEdit':
            return <MemoIconEdit size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconShieldFilled':
            return <MemoIconShieldFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconShieldCheckFilled':
            return <MemoIconShieldCheckFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        default: return <MemoIconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
    }

}