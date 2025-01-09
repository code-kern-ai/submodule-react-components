import SortArrows from "@/submodules/react-components/components/kern-table/SortArrows";
import { KernTableProps } from "../../types/kern-table";
import { AbortSessionButtonCell, ArchiveReasonCell, BadgeCell, CancelTaskCell, CommentsCell, ConfigCell, DeleteUserCell, EditDeleteOrgButtonCell, ExportConsumptionAndDeleteCell, IconCell, LevelCell, MaxRowsColsCharsCell, OrganizationAndUsersCell, OrganizationUserCell, ProjectNameTaskCell, ViewStackCell } from "./CellComponents";
import { Fragment } from "react";
import { IconEdit } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { NotApplicableBadge } from "@/submodules/react-components/components/Badges";

export default function KernTable(props: KernTableProps) {
    return (
        <table className="min-w-full divide-y divide-gray-300 rounded-b-lg">
            <thead className="bg-gray-50">
                <tr>
                    {props.headers.map((header) => (
                        <th scope="col"
                            className={`px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500 ${header.hasSort ? 'hover:text-gray-700 cursor-pointer' : ''}`}
                            id={header.id} key={header.id}
                            onClick={header.hasSort ? () => props.config.onClickSort(header.id) : undefined}
                        >
                            {header.hasCheckboxes ? <>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                    checked={header.checked}
                                    onChange={header.onChange}
                                />
                            </> : <div className="inline-flex flex-row items-center">
                                {header.column}
                                {header.hasSort && <SortArrows sortKey={props.config.sortKey} property={header.id} />}
                            </div>}
                        </th>))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {props.values?.map((row, index) => (
                    <tr key={index} className={index % 2 != 0 ? "bg-gray-50" : "bg-white"}>
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
                    </tr>))}
            </tbody>
        </table>
    )
}

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
                case 'BadgeCell':
                    return <BadgeCell {...cell} />;
                case 'OrganizationUserCell':
                    return <OrganizationUserCell {...cell} />;
                case 'DeleteUserCell':
                    return <DeleteUserCell {...cell} />;
                case 'LevelCell':
                    return <LevelCell {...cell} />;
                case 'ArchiveReasonCell':
                    return <ArchiveReasonCell {...cell} />;
                case 'ProjectNameTaskCell':
                    return <ProjectNameTaskCell {...cell} />;
                case 'CancelTaskCell':
                    return <CancelTaskCell {...cell} />;
                case 'IconCell':
                    return <IconCell {...cell} />;
                case 'ConfigCell':
                    return <ConfigCell {...cell} />;
                case 'EditDeleteOrgButtonCell':
                    return <EditDeleteOrgButtonCell {...cell} />;
                case 'ViewStackCell':
                    return <ViewStackCell {...cell} />;
                case 'AbortSessionButtonCell':
                    return <AbortSessionButtonCell {...cell} />;
            }
        case 'text':
            return <span>{cell.value ?? <NotApplicableBadge />}</span>
        case 'number':
            return <span>{cell.value[1]}</span>
        case 'boolean':
            return <input type="checkbox" checked={cell.value} onClick={cell.valueChange ? cell.valueChange : undefined} readOnly />
        case 'dateInput':
            return <input type="date" id="start" className="border-0" value={cell.value[1]} onChange={cell.valueChange} />
        case 'date':
            return <span>{(cell.value[1] && cell.value !== "") ? cell.value[1] : <NotApplicableBadge />}</span>
        case 'dropdown':
            return <KernDropdown options={cell.options} disabled={cell.disabled} buttonName={cell.value} dropdownWidth="w-40" selectedOption={(value) => cell.selectedOption(value)} />
        default:
            return null;
    }
}