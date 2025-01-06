import { NotApplicableBadge } from "@/src/components/Badges"
import { DeleteOrganizationButton } from "@/src/components/Buttons";
import { Tooltip } from "@nextui-org/react";
import { IconFileDownload, IconNotes } from "@tabler/icons-react";

function OrganizationAndUsersCell({ organization }) {
    return (
        <div className="grid justify-items-center">
            <div style={{ minWidth: "80px" }} className="text-center text-indigo-600 font-medium text-sm">{organization.name} </div>

            <div className="w-5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block font-medium text-sm" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-gray-500 ml-1">{organization.userCount}</span>
            </div>
        </div>
    )
}


function MaxRowsColsCharsCell({ organization }) {
    return (
        <div className="flex flex-row items-center justify-center">
            <span>{organization.maxRows ?? <NotApplicableBadge />} | {organization.maxCols ?? <NotApplicableBadge />} | {organization.maxCharCount ?? <NotApplicableBadge />}</span>
        </div>
    )
}

function CommentsCell({ hasComments, onClick }) {
    return (
        <div className="cursor-pointer" onClick={onClick}>
            <Tooltip content={hasComments ? 'Has comments' : 'No comments'} color="invert" className="m-auto">
                <IconNotes
                    strokeWidth={1.5}
                    className={`h-6 w-6 m-auto ${hasComments ? 'text-gray-500' : 'text-gray-300'}`} />
            </Tooltip>
        </div>
    )
}

function ExportConsumptionAndDeleteCell({ organization, onClickConsumptionExport, deleteOrg }) {
    return (
        <div className="flex items-center gap-x-6 justify-end">
            <div className="cursor-pointer" onClick={onClickConsumptionExport}>
                <Tooltip content="Export Consumption" color="invert">
                    <IconFileDownload
                        strokeWidth={1.5}
                        className={"h-6 w-6 m-auto text-gray-500"} />
                </Tooltip>
            </div>
            <DeleteOrganizationButton organization={organization} onClick={deleteOrg} />
        </div>
    )
}

export { OrganizationAndUsersCell, MaxRowsColsCharsCell, CommentsCell, ExportConsumptionAndDeleteCell }