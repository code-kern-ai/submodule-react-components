import { memo } from "react";
import { useDefaults } from "../hooks/useDefaults";
import { NO_TABLE_ENTRIES_YET_DEFAULTS, NoTableEntriesYetProps } from "../types/noTableEntriesYet";
import { Loading } from '@nextui-org/react';

function GetNoTableEntriesYet(_props: NoTableEntriesYetProps) {
    const [props] = useDefaults<NoTableEntriesYetProps>(_props, NO_TABLE_ENTRIES_YET_DEFAULTS);

    return <tr>
        <td colSpan={props.tableColumns}>
            <div className={`flex justify-center items-center w-full text-sm ${props.heightClass + " " + props.backgroundColorClass + " " + props.textColorClass + " " + props.marginBottomClass}`}>
                {props.loading?
                <div className={`flex ${props.loadingColorClass}`}>
                    <Loading size="md" type="spinner" color="currentColor"/>
                </div>
                :
                props.text}
            </div>
        </td>
    </tr>

}

export const NoTableEntriesYet = memo(GetNoTableEntriesYet)