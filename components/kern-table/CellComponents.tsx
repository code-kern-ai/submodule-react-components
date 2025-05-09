import { ActiveBadge, InactiveBadge, NotApplicableBadge } from "@/submodules/react-components/components/Badges"
import { Link, Tooltip } from "@nextui-org/react";
import { IconAlertCircle, IconAlertTriangleFilled, IconArrowRight, IconCircleCheckFilled, IconExternalLink, IconFileDownload, IconInfoCircle, IconInfoSquare, IconLoader, IconNotes, IconTag, IconThumbDownFilled, IconThumbUpFilled, IconTrash, IconUserX } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { Application } from "../../hooks/web-socket/constants";
import SVGIcon from "../SVGIcon";
import { useCallback, useMemo } from "react";
import KernButton from "../kern-button/KernButton";
import { AdminMessageLevel } from "../../types/admin-messages";
import { FeedbackType, ModelsDownloadedStatus } from "@/submodules/javascript-functions/enums/enums";
import LoadingIcon from "@/submodules/react-components/components/LoadingIcon";
import { EvaluationRunState } from "../../types/evaluationRun";
import { MemoIconAlertCircle, MemoIconAlertTriangleFilled, MemoIconArrowRight, MemoIconCircleCheckFilled, MemoIconExternalLink, MemoIconFileDownload, MemoIconInfoCircle, MemoIconInfoSquare, MemoIconLoader, MemoIconNotes, MemoIconTag, MemoIconThumbDownFilled, MemoIconThumbUpFilled, MemoIconTrash, MemoIconUserX } from "../kern-icons/icons";


function OrganizationAndUsersCell({ organization }) {
    return (
        <div className="grid justify-items-center">
            <div className="text-center text-indigo-600 font-medium text-sm">{organization.name} </div>

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
                <MemoIconNotes
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
                    <MemoIconFileDownload
                        strokeWidth={1.5}
                        className={"h-6 w-6 m-auto text-gray-500"} />
                </Tooltip>
            </div>
            <KernButton text="Delete" onClick={clickDelete} buttonColor="red" />
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
            <MemoIconUserX
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
    return <>{value == AdminMessageLevel.INFO ? (<MemoIconInfoSquare className='text-blue-700 h-6 w-6' />) : (<MemoIconInfoCircle className='text-yellow-700 h-6 w-6' />)}</>
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
        {value === FeedbackType.POSITIVE && <MemoIconThumbUpFilled className="h-6 w-6 text-green-600" aria-hidden="true" />}
        {value === FeedbackType.NEGATIVE && <MemoIconThumbDownFilled className="h-6 w-6 text-red-600" aria-hidden="true" />}
        {value === FeedbackType.NEUTRAL && <MemoIconThumbUpFilled className="h-6 w-6 text-orange-600 -rotate-90" aria-hidden="true" />}
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
            <MemoIconTag className='h-4 w-4' />
        </Link>
    </div>
}

function RemoteVersionCell({ service }) {
    return <div className="flex flex-row items-center justify-center">
        <div className="mr-2">{service.remoteVersion}</div>
        {service.remoteHasNewer && <Tooltip placement="right" trigger="hover" color="invert" content='Newer version available' className="cursor-auto">
            <MemoIconAlertCircle className="h-5 w-5 text-yellow-700" />
        </Tooltip>}
    </div>
}

function ExternalLinkCell({ link }) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="h-4 w-4 m-auto block p-0">
        <MemoIconExternalLink className="h-4 w-4 m-auto" />
    </a>
}

function ModelDateCell({ model }) {
    return <>
        {model.date != '0' && (model.status === ModelsDownloadedStatus.FINISHED || model.status === ModelsDownloadedStatus.DOWNLOADING) ? model.parseDate : '-'}
        {model.status === ModelsDownloadedStatus.INITIALIZING && <>{model.date}</>}
    </>
}

function FileSizeCell({ model }) {
    return <>{model.status === ModelsDownloadedStatus.FINISHED ? model.sizeFormatted : '-'}</>
}

function StatusModelCell({ model }) {
    return <div className="flex justify-center">
        {model.status === ModelsDownloadedStatus.FINISHED && <Tooltip content="Successfully created" color="invert" placement="top" className="cursor-auto">
            <MemoIconCircleCheckFilled className="h-6 w-6 text-green-500" />
        </Tooltip>}
        {model.status === ModelsDownloadedStatus.FAILED && <Tooltip content="Execution ran into errors" color="invert" placement="top" className="cursor-auto">
            <MemoIconAlertTriangleFilled className="h-6 w-6 text-red-500" />
        </Tooltip>}
        {model.status === ModelsDownloadedStatus.DOWNLOADING && <Tooltip content="Model is downloading" color="invert" placement="top" className="cursor-auto">
            <LoadingIcon />
        </Tooltip>}
        {model.status === ModelsDownloadedStatus.INITIALIZING && <Tooltip content="Model is initializing" color="invert" placement="top" className="cursor-auto">
            <MemoIconLoader className="h-6 w-6 text-gray-500" />
        </Tooltip>}
    </div>
}

function DeleteModelCell({ isAdmin, model, onClick }) {
    return <>{isAdmin && <MemoIconTrash onClick={() => onClick(model)}
        className="h-6 w-6 text-red-700 cursor-pointer" />}</>
}

function LabelCell({ sourceContainer }) {
    return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${sourceContainer.color.backgroundColor} ${sourceContainer.color.textColor} ${sourceContainer.color.borderColor}`}>
        {sourceContainer.label}
    </span>
}

function ViewCell({ onClick, disabled }) {
    const clickView = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);
    return <KernButton text="View" onClick={clickView} disabled={disabled} />
}

function EvaluationRunStateCell({ value }) {
    const color = useMemo(() => {
        switch (value) {
            case EvaluationRunState.INITIATED:
                return 'gray';
            case EvaluationRunState.RUNNING:
                return 'yellow';
            case EvaluationRunState.SUCCESS:
                return 'green';
            case EvaluationRunState.FAILED:
                return 'red';
        }
    }, [value]);

    const className = useMemo(() => {
        return `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color === 'green'
            ? 'bg-green-300'
            : 'bg-' + color + '-100 text-' + color + '-800'}`;
    }, [color]);

    return (
        <span className={className}>
            <svg className={`mr-1.5 h-2 w-2 ${'text-' + color + '-400'}`} fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
            </svg>
            <span className={' text-' + color + '-800'}>{value}</span>
        </span>
    );
}

function EvaluationRunDetailsCell({ onClick, disabled }) {
    return <button type="button" className="text-green-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClick} disabled={disabled}>
        <span className="leading-5">Details</span>
        <MemoIconArrowRight className="h-5 w-5 inline-block text-green-800" />
    </button>
}

function EtlApiTokenCell({ organization }) {
    return (
        <div className="flex flex-row items-center justify-center">
            <span>{organization.fileUploadLimit ?? <NotApplicableBadge />} | {organization.fileUploadInterval ?? <NotApplicableBadge />}</span>
        </div>
    )
}

export { OrganizationAndUsersCell, MaxRowsColsCharsCell, CommentsCell, ExportConsumptionAndDeleteCell, BadgeCell, OrganizationUserCell, DeleteUserCell, LevelCell, ArchiveReasonCell, ProjectNameTaskCell, CancelTaskCell, IconCell, ConfigCell, EditDeleteOrgButtonCell, ViewStackCell, AbortSessionButtonCell, FeedbackMessageCell, FeedbackMessageTextCell, JumpToConversationCell, RemoteVersionCell, ExternalLinkCell, ModelDateCell, FileSizeCell, StatusModelCell, DeleteModelCell, LabelCell, ViewCell, EvaluationRunStateCell, EvaluationRunDetailsCell, EtlApiTokenCell }