import { ActiveBadge, InactiveBadge, NotApplicableBadge } from "@/submodules/react-components/components/Badges"
import { Link, Tooltip } from "@nextui-org/react";
import { IconFileDownload, IconInfoCircle, IconInfoSquare, IconNotes, IconTag, IconThumbDownFilled, IconThumbUpFilled, IconUserX } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { Application } from "../../hooks/web-socket/constants";
import SVGIcon from "../SVGIcon";
import { useCallback } from "react";
import KernButton from "../kern-button/KernButton";
import { AdminMessageLevel } from "../../types/admin-messages";
import { FeedbackType } from "@/submodules/javascript-functions/enums/enums";

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
    const clickDelete = useCallback(() => {
        if (deleteOrg) deleteOrg(organization);
    }, [deleteOrg, organization]);

    return (
        <div className="flex items-center gap-x-6 justify-end">
            <div className="cursor-pointer" onClick={onClickConsumptionExport}>
                <Tooltip content="Export Consumption" color="invert">
                    <IconFileDownload
                        strokeWidth={1.5}
                        className={"h-6 w-6 m-auto text-gray-500"} />
                </Tooltip>
            </div>
            <KernButton text="Delete" onClick={clickDelete} buttonColor="red" />;
        </div>
    )
}

function BadgeCell({ value }) {
    return <span> {value ? (<ActiveBadge />) : (<InactiveBadge />)}</span>
}

function OrganizationUserCell({ userToOrganization, organizations, user, onClickRemove, onClickAdd }) {
    return <>{(userToOrganization && user.id in userToOrganization) ? (<div className="flex items-center flex-row">
        <span className="mr-2">{userToOrganization[user.id]['name']}</span>
        <div onClick={() => onClickRemove(user.id)} className="cursor-pointer">
            <IconUserX
                size={20}
                strokeWidth={2}
                className='text-gray-900 font-bold cursor-pointer' />
        </div>
    </div>) : (
        <KernDropdown options={organizations} buttonName="Choose" selectedOption={(option) => onClickAdd(option)} doNotUseTextArray={true} scrollAfterNOptions={10} />
    )}</>
}

function DeleteUserCell({ user, deleteUser }) {
    const clickDelete = useCallback(() => {
        if (deleteUser) deleteUser(user);
    }, [deleteUser, user]);

    return <KernButton
        text="Delete"
        onClick={clickDelete}
        buttonColor="red"
    />;
}

function LevelCell({ value }) {
    return <>{value == AdminMessageLevel.INFO ? (<IconInfoSquare className='text-blue-700 h-6 w-6' />) : (<IconInfoCircle className='text-yellow-700 h-6 w-6' />)}</>
}

function ArchiveReasonCell({ message, onClick }) {
    const clickArchive = useCallback(() => {
        if (onClick) onClick(message);
    }, [onClick, message]);

    return <>{message.archivedReason ? (
        <span>{message.archivedReason}</span>
    ) : (
        <KernButton text="Archive" onClick={clickArchive} buttonColor="green" />
    )}</>
}

function ProjectNameTaskCell({ task }) {
    return <div className="flex items-center flex-row justify-center">
        {task.projectName ?? <NotApplicableBadge />}
        {<Tooltip content={task.applicationName} color="invert" className="cursor-auto">
            <img src={task.applicationName == Application.REFINERY ? '/admin/dashboard/refinery-icon.png' : '/admin/dashboard/kern-icon.png'} className="w-6 h-6 ml-2" />
        </Tooltip>}
    </div>
}

function CancelTaskCell({ task, onClick }) {
    const clickCancel = useCallback(() => {
        if (onClick) onClick(task);
    }, [onClick, task]);

    return <KernButton text={task?.isActive ? "Cancel" : "Delete"} onClick={clickCancel} buttonColor="red" />
}

function IconCell({ icon }) {
    return (<div className="flex items-center w-full h-full justify-center">
        <SVGIcon icon={icon} size={32} strokeWidth={2} />
    </div>)
}

function ConfigCell({ config }) {
    return <Tooltip content={<span className="whitespace-pre">{config}</span>} color="invert" hideArrow={true} placement='bottom'>
        <SVGIcon icon="IconFileInfo" size={32} strokeWidth={2} />
    </Tooltip>
}

function EditDeleteOrgButtonCell({ button, clickEdit }) {
    return <div className="flex flex-row gap-x-2 items-center">
        <div className="rounded-lg cursor-pointer" onClick={() => clickEdit(button)}>
            <SVGIcon icon="IconFilePencil" size={32} strokeWidth={2} />
        </div>
        <KernButton text="Delete" onClick={button.delFunc} buttonColor="red" />
    </div>
}

function ViewStackCell({ onClick }) {
    const clickView = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);
    return <KernButton text="View stack" onClick={clickView} />
}

function AbortSessionButtonCell({ session, onClick }) {
    const clickAbort = useCallback(() => {
        if (onClick) onClick(session);
    }, [onClick, session]);

    return <KernButton text="Abort" onClick={clickAbort} buttonColor="red" />
}

function FeedbackMessageCell({ value }) {
    return <div className="flex justify-center">
        {value === FeedbackType.POSITIVE && <IconThumbUpFilled className="h-6 w-6 text-green-600" aria-hidden="true" />}
        {value === FeedbackType.NEGATIVE && <IconThumbDownFilled className="h-6 w-6 text-red-600" aria-hidden="true" />}
        {value === FeedbackType.NEUTRAL && <IconThumbUpFilled className="h-6 w-6 text-orange-600 -rotate-90" aria-hidden="true" />}
    </div>
}

function FeedbackMessageTextCell({ value }) {
    return <span className={`${!value ? 'italic' : ''}`}>{value || 'No entry'}</span>
}

function JumpToConversationCell({ projectId, conversationId }) {
    return <div className="flex justify-center">
        <Link
            href={`/cognition/projects/${projectId}/ui/${conversationId}`}
            className='inline-flex p-2 items-center justify-center rounded-lg hover:bg-gray-200'
        >
            <IconTag className='h-4 w-4' />
        </Link>
    </div>
}

export { OrganizationAndUsersCell, MaxRowsColsCharsCell, CommentsCell, ExportConsumptionAndDeleteCell, BadgeCell, OrganizationUserCell, DeleteUserCell, LevelCell, ArchiveReasonCell, ProjectNameTaskCell, CancelTaskCell, IconCell, ConfigCell, EditDeleteOrgButtonCell, ViewStackCell, AbortSessionButtonCell, FeedbackMessageCell, FeedbackMessageTextCell, JumpToConversationCell }