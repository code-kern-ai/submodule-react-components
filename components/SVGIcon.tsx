import { IconBolt, IconChevronDown, IconCode, IconDotsVertical, IconExternalLink, IconFileInfo, IconFilePencil, IconLoader, IconPlayerPlayFilled, IconSquare, IconSquareCheck, IconTrash } from '@tabler/icons-react';

export const SUPPORTED_ICONS = ['IconCode', 'IconBolt', 'IconSquareCheck', 'IconSquare', 'IconPlayerPlayFilled', 'IconTrash', 'IconExternalLink',
    'IconLoader', 'IconFilePencil', 'IconFileInfo'
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
            return <IconCode size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconBolt':
            return <IconBolt size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconSquareCheck':
            return <IconSquareCheck size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconSquare':
            return <IconSquare size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconPlayerPlayFilled':
            return <IconPlayerPlayFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconTrash':
            return <IconTrash size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconExternalLink':
            return <IconExternalLink size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconChevronDown':
            return <IconChevronDown size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconDotsVertical':
            return <IconDotsVertical size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconLoader':
            return <IconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconFilePencil':
            return <IconFilePencil size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        case 'IconFileInfo':
            return <IconFileInfo size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
        default: return <IconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''}`} />
    }

}