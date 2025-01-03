import SortArrows from "@/src/components/SortArrows";
import { KernTableProps } from "../../types/kern-table";
import { CommentsCell, ExportConsumptionAndDeleteCell, MaxRowsColsCharsCell, OrganizationAndUsersCell } from "./CellComponents";
import { Fragment } from "react";
import { IconEdit } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { ADMIN_LOG_LEVELS } from "@/src/components/organization/OrganizationsTable";
import { NotApplicableBadge } from "@/src/components/Badges";

export default function KernTable(props: KernTableProps) {
    return (
        <table className="min-w-full divide-y divide-gray-300 rounded-b-lg">
            <thead className="bg-gray-50">
                <tr>
                    {props.headers.map((header) => (
                        <th scope="col"
                            className={`px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500 ${props.config?.sortingColumns?.includes(header.id) ? 'hover:text-gray-700 cursor-pointer' : ''}`}
                            id={header.id} key={header.id}
                            onClick={props.config.onClickSort ? () => props.config.onClickSort(header.id) : undefined}
                        >
                            <div className="inline-flex flex-row items-center">
                                {header.column}
                                {props.config?.sortingColumns?.includes(header.id) && <SortArrows sortKey={props.config.sortKey} property={header.id} />}
                            </div>
                        </th>))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {props.values?.map((row, index) => (<>
                    <tr key={row} className={index % 2 != 0 ? "bg-gray-50" : "bg-white"}>
                        {row.map((cell, index) => {
                            return <Fragment key={index}>
                                <td className="whitespace-nowrap text-center px-3 py-2 text-sm text-gray-500 ">
                                    <div className="flex flex-row items-center justify-center gap-x-2">
                                        <ComponentMapper {...cell} />
                                        {cell.editFunction && <IconEdit className="h-5 w-5 text-gray-500 cursor-pointer" onClick={cell.editFunction} />}
                                    </div>
                                </td>
                            </Fragment>
                        })}
                    </tr>
                </>))}
            </tbody>
        </table>
    )
}

// First value is used for sorting, second value is used for display
function ComponentMapper(cell: any) {
    switch (cell.type) {
        case 'Component':
            switch (cell.component) {
                case 'OrganizationAndUsersCell':
                    return <OrganizationAndUsersCell {...cell} />;
                case 'MaxRowsColsCharsCell':
                    return <MaxRowsColsCharsCell {...cell} />;
                case 'CommentsCell':
                    return <CommentsCell {...cell} />;
                case 'ExportConsumptionAndDeleteCell':
                    return <ExportConsumptionAndDeleteCell {...cell} />;
            }
        case 'text':
            return <span>{cell.value ?? <NotApplicableBadge />}</span>
        case 'number':
            return <span>{cell.value[1]}</span>
        case 'boolean':
            return <input type="checkbox" checked={cell.value} onClick={cell.valueChange} readOnly />
        case 'date':
            return <input type="date" id="start" className="border-0" value={cell.value[1]} onChange={cell.valueChange} />
        case 'dropdown':
            return <KernDropdown options={ADMIN_LOG_LEVELS} buttonName={cell.value} dropdownWidth="w-32" selectedOption={(value) => cell.selectedOption(value)} />
        default:
            return null;
    }
}