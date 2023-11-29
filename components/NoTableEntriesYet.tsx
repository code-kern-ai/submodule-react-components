import { memo } from "react";
import { useDefaults } from "../hooks/useDefaults";


type Props = {
    tableColumns: number;
    text?: string;
    heightClass?: string;
    backgroundColorClass?: string;
    textColorClass?: string;
    marginBottomClass?: string; // can be used to offset common table paddings, usually negative
}

const DEFAULTS = {
    text: 'No data yet',
    heightClass: 'h-16',
    backgroundColorClass: 'bg-gray-50',
    textColorClass: 'text-gray-700',
    marginBottomClass: "",
}



function GetNoTableEntriesYet(_props: Props) {
    const [props] = useDefaults<Props>(_props, DEFAULTS);

    return <tr>
        <td colSpan={props.tableColumns}>
            <div className={`flex justify-center items-center w-full text-sm ${props.heightClass + " " + props.backgroundColorClass + " " + props.textColorClass + " " + props.marginBottomClass}`}>
                {props.text}
            </div>
        </td>
    </tr>

}

export const NoTableEntriesYet = memo(GetNoTableEntriesYet)