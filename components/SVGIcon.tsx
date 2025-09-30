import { IconHammer, IconSettingsFilled, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { MemoIconBolt, MemoIconChevronDown, MemoIconCode, MemoIconDotsVertical, MemoIconEdit, MemoIconExternalLink, MemoIconFileInfo, MemoIconFilePencil, MemoIconLoader, MemoIconPlayerPlayFilled, MemoIconPlus, MemoIconSettings, MemoIconShieldCheckFilled, MemoIconShieldFilled, MemoIconSquare, MemoIconSquareCheck, MemoIconStar, MemoIconTag, MemoIconTrash } from './kern-icons/icons';

export const SUPPORTED_ICONS = ['IconCode', 'IconBolt', 'IconSquareCheck', 'IconSquare', 'IconPlayerPlayFilled', 'IconTrash', 'IconExternalLink',
    'IconLoader', 'IconFilePencil', 'IconFileInfo', 'IconEdit', 'IconShieldFilled', 'IconShieldCheckFilled', 'IconPlus', 'IconSettings', 'IconSettingsFilled',
    'IconHammer', 'IconZoomIn', 'IconZoomOut', 'IconTag', 'IconStar'
]

type SVGIconProps = {
    icon: string,
    size?: number,
    strokeWidth?: number,
    useFillForIcons?: boolean,
    addClasses?: string
}

export default function SVGIcon(props: SVGIconProps) {
    switch (props.icon) {
        case 'IconTag':
            return <MemoIconTag size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconCode':
            return <MemoIconCode size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconBolt':
            return <MemoIconBolt size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconSquareCheck':
            return <MemoIconSquareCheck size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconSquare':
            return <MemoIconSquare size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconPlayerPlayFilled':
            return <MemoIconPlayerPlayFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconTrash':
            return <MemoIconTrash size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconExternalLink':
            return <MemoIconExternalLink size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconChevronDown':
            return <MemoIconChevronDown size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconDotsVertical':
            return <MemoIconDotsVertical size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconLoader':
            return <MemoIconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconFilePencil':
            return <MemoIconFilePencil size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconFileInfo':
            return <MemoIconFileInfo size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconEdit':
            return <MemoIconEdit size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconShieldFilled':
            return <MemoIconShieldFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconShieldCheckFilled':
            return <MemoIconShieldCheckFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconPlus':
            return <MemoIconPlus size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconSettings':
            return <MemoIconSettings size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconSettingsFilled':
            return <IconSettingsFilled size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconHammer':
            return <IconHammer size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconZoomIn':
            return <IconZoomIn size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconZoomOut':
            return <IconZoomOut size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        case 'IconStar':
            return <MemoIconStar size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
        default: return <MemoIconLoader size={props.size} strokeWidth={props.strokeWidth} className={`${props.useFillForIcons ? 'fill-gray-800' : ''} ${props.addClasses}`} />
    }

}