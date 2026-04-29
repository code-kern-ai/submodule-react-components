import { ActiveBadge, InactiveBadge, NotApplicableBadge } from "@/submodules/react-components/components/Badges"
import { combineClassNames } from "@/submodules/javascript-functions/general";
import { Link, Tooltip } from "@nextui-org/react";
import KernDropdown from "../KernDropdown";
import { Application } from "../../hooks/web-socket/constants";
import SVGIcon from "../SVGIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import KernButton from "../kern-button/KernButton";
import { AdminMessageLevel } from "../../types/admin-messages";
import { FeedbackType, IntegrationState, IntegrationStateColor, ModelsDownloadedStatus } from "@/submodules/javascript-functions/enums/enums";
import LoadingIcon from "@/submodules/react-components/components/LoadingIcon";
import { EvaluationRunState } from "../../types/evaluationRun";
import { MemoIconAdjustmentsHorizontal, MemoIconAlertCircle, MemoIconAlertTriangleFilled, MemoIconArrowRight, MemoIconCheck, MemoIconCircleCheck, MemoIconCircleCheckFilled, MemoIconCircleOff, MemoIconClock, MemoIconEdit, MemoIconExternalLink, MemoIconFileDownload, MemoIconInfoCircle, MemoIconInfoSquare, MemoIconLoader, MemoIconNotes, MemoIconPlayerPlay, MemoIconRefresh, MemoIconTag, MemoIconThumbDownFilled, MemoIconThumbUpFilled, MemoIconTrash, MemoIconUserX, MemoIconX } from "../kern-icons/icons";
import ButtonAsText from "../kern-button/ButtonAsText";
import IconButton from "../kern-button/IconButton";
import { InfoButton } from "../InfoButton";

const INTEGRATION_STATES_ORDER = Object.values(IntegrationState);
const INTEGRATION_STATE_COLORS_ORDER = Object.values(IntegrationStateColor);
const INTEGRATION_TIMEZONE_OFFSET_MS = new Date().getTimezoneOffset() * 60000;
const MARKDOWN_ETL_STATES = ['QUEUE', 'STARTED', 'EXTRACTING', 'TOKENIZING', 'SPLITTING', 'TRANSFORMING', 'FINISHED'];
const MARKDOWN_ETL_STATE_COLORS = ['purple', 'blue', 'pink', 'yellow', 'orange', 'indigo', 'green'];
const MARKDOWN_TIMEZONE_OFFSET_MS = new Date().getTimezoneOffset() * 60000;

function OrganizationAndUsersCell({ organization }) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-center text-indigo-600 font-medium text-sm">{organization.name} </div>

            <Tooltip content="Total/Normal/Light" color="invert" placement="right">
                <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block font-medium text-sm" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-gray-500 ml-1">{!organization.userCount ? <NotApplicableBadge /> : organization.userCount.total + " / " + organization.userCount.normal + " / " + organization.userCount.light}</span>
                </div>
            </Tooltip>
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

function NulledBadgeCell({ value, tooltip, tooltipPlacement }: { value: boolean | null | undefined, tooltip?: string, tooltipPlacement?: "top" | "bottom" | "left" | "right" }) {
    const cell = <span> {value == true ? (<ActiveBadge />) : value == false ? (<InactiveBadge />) : (<NotApplicableBadge />)}</span>
    if (tooltip) return <Tooltip content={tooltip} color="invert" placement={tooltipPlacement}>{cell}</Tooltip>
    else return cell;
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

function DeleteCell({ deleteEntity }) {
    const clickDelete = useCallback(() => {
        if (deleteEntity) deleteEntity();
    }, [deleteEntity]);

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

function EditDeleteOrgButtonCell({ clickDelete, clickEdit }) {
    return <div className="flex flex-row gap-x-2 items-center">
        <div className="rounded-lg cursor-pointer" onClick={clickEdit}>
            <SVGIcon icon="IconFilePencil" size={32} strokeWidth={2} />
        </div>
        <KernButton text="Delete" onClick={clickDelete} buttonColor="red" />
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

function LightUserConfigCell({ organization }) {
    return (
        <div className="flex flex-row items-center justify-center">
            {!organization.lightUserConfig ? <NotApplicableBadge /> :
                <span className={organization.lightUserConfig?.isActive === false ? "opacity-50 line-through" : undefined}>{organization.lightUserConfig?.amount} / {organization.lightUserConfig.timeFrame}</span>}
        </div>
    )
}

function EmailCell({ user }) {
    const tooltipContent = useMemo(() => {
        let content = user.email;
        if (user.sso_provider) content = "SSO User via " + user.sso_provider;
        if (user.new_admin_role) content += " (admin)";
        return content;
    }, [user])

    return (
        <div className="flex flex-row items-center">

            {user.new_admin_role ? <Tooltip content={tooltipContent} color="invert">
                <span className="text-orange-700 truncate max-w-xs">{user.email}*</span></Tooltip> :
                user.sso_provider ? <Tooltip content={tooltipContent} color="invert">
                    <span className="text-blue-700 truncate max-w-xs">{user.email}*</span></Tooltip> :
                    <Tooltip content={tooltipContent} color="invert" className="cursor-auto">
                        <span className="truncate max-w-xs">{user.email}</span>
                    </Tooltip>
            }
        </div>
    )
}

function EditIntegrationCell({ onClick }) {
    const clickEdit = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return <KernButton text="Edit" onClick={clickEdit} className="text-gray-700" />
}

function ExpiredTokenCell({ value }) {
    return <div className="flex justify-center">
        {value[0]}
        {value[1] && <Tooltip content="Expired Token" color="invert" placement="top" className="cursor-auto">
            <MemoIconAlertCircle className="h-6 w-6 text-red-500" />
        </Tooltip>}
    </div>
}

function LinkCell({ value }) {
    return <>
        {value ? <div className="flex justify-center gap-x-2">
            <span>{value}</span>
            <a href={value} target="_blank" rel="noopener noreferrer" className="h-4 w-4 m-auto block p-0">
                <MemoIconExternalLink className="h-4 w-4 m-auto" />
            </a>
        </div> : <NotApplicableBadge />}
    </>
}

function ConfigReleaseNotificationCell({ onClickView, onClickEdit }) {
    return <div className="flex justify-center gap-x-2 items-center">
        <KernButton text="View" onClick={onClickView} />
        <MemoIconEdit className="h-5 w-5 text-gray-700 cursor-pointer" onClick={onClickEdit} />
    </div>;
}

function TruncateAndTooltipCell({ value, hasError = false }) {
    return <div className="flex items-center">
        {hasError && <MemoIconAlertTriangleFilled className="h-5 w-5 text-red-600 mr-2" />}
        {value ? <Tooltip content={<span className="block max-w-[300px] break-words max-h-[500px] overflow-y-auto">{value}</span>} color="invert" hideArrow={true} placement='bottom'>
            <span className="block max-w-56 truncate">{value}</span>
        </Tooltip> : <NotApplicableBadge />}
    </div>;
}

function DatasetOverviewRowCheckboxCell({ isSelected, onToggle }: { isSelected: boolean; onToggle: () => void }) {
    return (
        <div className="relative px-7 sm:w-12 sm:px-6">
            {isSelected ? <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" /> : null}
            <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={isSelected}
                onChange={onToggle}
            />
        </div>
    );
}

function DatasetOverviewCreatedAtCell({ displayValue, isSelected }: { displayValue: string; isSelected: boolean }) {
    return (
        <span className={combineClassNames('font-medium', isSelected ? 'text-indigo-600' : 'text-gray-900')}>
            {displayValue}
        </span>
    );
}

function DatasetOverviewDescriptionCell({ value }: { value: string }) {
    return <span className="max-w-sm truncate text-gray-500">{value}</span>;
}

function DatasetOverviewActionsCell({ onEdit, onDisplayConfig, onShow }: { onEdit: () => void; onDisplayConfig: () => void; onShow: () => void }) {
    return (
        <div className="flex flex-row items-center justify-center gap-x-2">
            <KernButton
                text="Edit"
                onClick={onEdit}
                icon={MemoIconEdit}
                iconColor="indigo"
                className="ml-auto"
                size="small"
            />
            <Tooltip color="invert" content="Display dataset configuration" className="m-auto">
                <IconButton icon={MemoIconInfoCircle} iconColor="black" onClick={onDisplayConfig} size="small" />
            </Tooltip>
            <ButtonAsText text="Show" color="indigo" onClick={onShow} />
        </div>
    );
}

function MarkdownOverviewStateCell({ state, startedAt, finishedAt, failedTooltip }: { state: string; startedAt: string; finishedAt?: string; failedTooltip: string }) {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const start = new Date(startedAt).getTime();
            let end = finishedAt ? new Date(finishedAt).getTime() : now;
            if (!finishedAt) end += MARKDOWN_TIMEZONE_OFFSET_MS;
            setTimeElapsed(Math.floor((end - start) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [state, startedAt, finishedAt]);

    const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');

    if (state === 'FAILED') {
        return (
            <Tooltip color="invert" content={failedTooltip}>
                <div className="h-5 w-fit rounded-md border border-red-300 bg-red-100 px-2 text-xs font-semibold text-red-800">
                    <span>{state}</span>
                </div>
            </Tooltip>
        );
    }

    return (
        <div className="flex min-w-[16rem] max-w-[min(100%,28rem)] flex-nowrap gap-x-1.5 overflow-x-auto rounded-md bg-gray-50 p-1">
            {MARKDOWN_ETL_STATES.map((s, index) => (
                <Tooltip key={s} content={s} placement="top" color="invert" className="cursor-default shrink-0">
                    <div
                        className={combineClassNames(
                            'flex h-5 shrink-0 items-center justify-center rounded-md text-xs font-semibold',
                            index <= MARKDOWN_ETL_STATES.indexOf(state)
                                ? combineClassNames(
                                    `border bg-${MARKDOWN_ETL_STATE_COLORS[index]}-100 border-${MARKDOWN_ETL_STATE_COLORS[index]}-300 text-${MARKDOWN_ETL_STATE_COLORS[index]}-800`,
                                    state === s ? 'min-w-[6.75rem] px-2' : 'w-5 min-w-[1.25rem]',
                                )
                                : 'w-5 min-w-[1.25rem] bg-gray-100 text-gray-800',
                        )}
                    >
                        {state === s ? (
                            <div className="flex items-center gap-x-1 whitespace-nowrap">
                                <span>{s}</span>
                                <span className="tabular-nums">{`${minutes}:${seconds}`}</span>
                            </div>
                        ) : null}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}

function MarkdownOverviewReviewedCell({ isReviewed }: { isReviewed: boolean }) {
    return (
        <div className='flex items-center justify-center'>
            {isReviewed ? (
                <MemoIconCheck className="w-5 h-5 text-green-500" />
            ) : (
                <MemoIconX className="w-5 h-5 text-red-500" />
            )}
        </div>
    );
}

function MarkdownOverviewParsingScopeCell({ scopeReadable }: { scopeReadable?: string }) {
    return (
        <div className='flex items-center justify-center'>
            <Tooltip content={scopeReadable ?? "n/a"} placement='top' color='invert'>
                <MemoIconInfoCircle className="h-5 w-5 text-gray-500" />
            </Tooltip>
        </div>
    );
}

function MarkdownOverviewRunCell({ state, isStale, isActive, etlTaskSubmitted, etlStaleChecking, onRun }: { state: string; isStale: boolean; isActive: boolean | null; etlTaskSubmitted: boolean; etlStaleChecking: boolean; onRun: () => void }) {
    return (
        <div className='flex items-center justify-center'>
            <KernButton
                icon={MemoIconPlayerPlay}
                className='border-none'
                iconColor={isStale ? 'yellow' : 'green'}
                disabled={(state !== 'FAILED' && state !== 'FINISHED') || (!isStale && (etlTaskSubmitted || isActive === null || isActive || state === 'FINISHED'))}
                onClick={onRun}
                loading={etlTaskSubmitted || etlStaleChecking || (state !== 'FAILED' && state !== 'FINISHED')}
            />
        </div>
    );
}

function MarkdownOverviewDownloadCell({ state, onDownload }: { state: string; onDownload: () => void }) {
    return (
        <div className='flex items-center justify-center'>
            <KernButton
                icon={MemoIconFileDownload}
                iconColor='gray'
                disabled={state !== 'FINISHED'}
                onClick={onDownload}
            />
        </div>
    );
}

function MarkdownOverviewShowCell({ state, onShow }: { state: string; onShow: () => void }) {
    return (
        <ButtonAsText
            text='Show'
            color='indigo'
            onClick={onShow}
            disabled={state !== 'FINISHED'}
        />
    );
}

function IntegrationOverviewStateTimeline({ state, startedAt, finishedAt }: { state: IntegrationState; startedAt: string; finishedAt?: string }) {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const start = new Date(startedAt).getTime();
            let end = finishedAt ? new Date(finishedAt).getTime() : now;
            if (!finishedAt) end += INTEGRATION_TIMEZONE_OFFSET_MS;
            setTimeElapsed(Math.floor((end - start) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [state, startedAt, finishedAt]);

    const minutes = Math.floor(timeElapsed / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');

    if (state === IntegrationState.FAILED) {
        return (
            <div className="flex h-5 w-fit items-center justify-center rounded-md border border-red-300 bg-red-100 px-2 text-xs font-semibold text-red-800">
                <span>{state}</span>
            </div>
        );
    }

    return (
        <div className="flex w-fit gap-x-2 rounded-md bg-gray-50 p-1">
            {INTEGRATION_STATES_ORDER.map((s, index) => (
                <Tooltip key={s} content={s} placement="top" color="invert" className="cursor-default">
                    <div
                        className={combineClassNames(
                            'flex h-5 items-center justify-center rounded-md text-xs font-semibold',
                            index <= INTEGRATION_STATES_ORDER.indexOf(state)
                                ? `w-fit border bg-${INTEGRATION_STATE_COLORS_ORDER[index]}-100 border-${INTEGRATION_STATE_COLORS_ORDER[index]}-300 px-2 text-${INTEGRATION_STATE_COLORS_ORDER[index]}-800`
                                : 'w-5 bg-gray-100 text-gray-800',
                        )}
                    >
                        {state === s && (
                            <div className="flex items-center gap-x-1">
                                <span>{s}</span>
                                <span>
                                    {minutes}:{seconds}
                                </span>
                            </div>
                        )}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}

function IntegrationsOverviewStateCell({ state, startedAt, finishedAt, failedTooltip, clockTooltip }: { state: IntegrationState; startedAt: string; finishedAt?: string; failedTooltip: string; clockTooltip: string }) {
    const timeline = (
        <IntegrationOverviewStateTimeline state={state} startedAt={startedAt} finishedAt={finishedAt} />
    );
    return (
        <div className="flex items-center justify-center gap-x-2">
            {state === IntegrationState.FAILED ? (
                <Tooltip color="invert" content={failedTooltip}>
                    {timeline}
                </Tooltip>
            ) : (
                timeline
            )}
            <div className="ml-auto">
                <Tooltip content={clockTooltip} color="invert" placement="top" className="cursor-auto">
                    <MemoIconClock className="h-5 w-5 text-black-500" />
                </Tooltip>
            </div>
        </div>
    );
}

function IntegrationsOverviewRefineryProjectCell({ projectLabel, showMissingProjectHint }: { projectLabel: string; showMissingProjectHint: boolean }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-1 text-gray-500">
            {showMissingProjectHint ? (
                <InfoButton
                    content="Please ensure that the project is created in Refinery before using the integration."
                    divPosition="top"
                    addClasses="w-80 text-black-500"
                    infoButtonSize="sm"
                />
            ) : null}
            {projectLabel}
        </div>
    );
}

function IntegrationsOverviewConfigsCell({ onDisplayConfig }: { onDisplayConfig: () => void }) {
    return (
        <Tooltip color="invert" content="Display transformation configuration">
            <IconButton icon={MemoIconInfoCircle} iconColor="black" onClick={onDisplayConfig} size="small" />
        </Tooltip>
    );
}

function IntegrationsOverviewEditCell({ onEdit, disabled }: { onEdit: () => void; disabled: boolean }) {
    return (
        <KernButton
            text="Edit"
            onClick={onEdit}
            icon={MemoIconEdit}
            iconColor="indigo"
            disabled={disabled}
        />
    );
}

function IntegrationsOverviewSyncCell({ isSynced, onSync }: { isSynced: boolean | null; onSync: () => void }) {
    return (
        <Tooltip
            color="invert"
            content={isSynced ? 'Integration is synced' : 'New changes detected, click to sync'}
            className="cursor-auto"
        >
            <KernButton
                text={isSynced ? 'Synced' : 'Sync'}
                disabled={isSynced || isSynced === null}
                onClick={onSync}
                icon={isSynced ? MemoIconCircleCheck : MemoIconRefresh}
                iconColor={isSynced ? 'green' : undefined}
                loading={isSynced === null}
            />
        </Tooltip>
    );
}

function IntegrationsOverviewSharepointCell({ syncActive, syncBusy, onAdjustSync }: { syncActive: boolean; syncBusy: boolean; onAdjustSync: () => void }) {
    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center gap-x-2 rounded-md border border-gray-200 bg-gray-50 pl-2">
                <Tooltip
                    className="cursor-auto"
                    color="invert"
                    content={syncActive ? 'Active' : 'Inactive'}
                >
                    {syncActive ? (
                        <MemoIconCircleCheck className="h-5 w-5 text-gray-600" />
                    ) : (
                        <MemoIconCircleOff className="h-5 w-5 text-gray-400" />
                    )}
                </Tooltip>
                <Tooltip color="invert" content="Adjust sharepoint property sync" className="cursor-auto">
                    <KernButton
                        text="Sync Props"
                        onClick={onAdjustSync}
                        icon={MemoIconAdjustmentsHorizontal}
                        disabled={syncBusy}
                        className="rounded-l-none border-0 hover:bg-gray-50"
                    />
                </Tooltip>
            </div>
        </div>
    );
}

function IntegrationsOverviewShowCell({ onShow, disabled }: { onShow: () => void; disabled: boolean }) {
    return <ButtonAsText text="Show" color="indigo" disabled={disabled} onClick={onShow} />;
}

function ConversationsInitialMessageCell({ value }: { value: string }) {
    return (
        <span className="max-w-sm truncate text-gray-500" title={value}>
            {value}
        </span>
    );
}

function ConversationsCountDotCell({ count, variant }: { count: number; variant: 'green' | 'red' }) {
    const dotClass = variant === 'green' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className="flex items-center justify-center gap-x-2">
            <div className={combineClassNames('h-2 w-2 rounded-full', dotClass)} />
            <span>{count}</span>
        </div>
    );
}

function ConversationsShowLogsCell({ onShowLogs }: { onShowLogs: () => void }) {
    return <ButtonAsText text="Show Logs" color="indigo" onClick={onShowLogs} />;
}

function ConversationsJumpToCell({ onJumpTo }: { onJumpTo: () => void }) {
    return <ButtonAsText text="Jump to" color="indigo" onClick={onJumpTo} />;
}

function EnvVarDescriptionCell({ value }: { value: string }) {
    return <span className="line-clamp-2 max-w-md text-left text-gray-500">{value}</span>;
}

function EnvVarEditCell({ onEdit }: { onEdit: () => void }) {
    return <ButtonAsText text="Edit" color="indigo" onClick={onEdit} />;
}

function GraphRAGSearchPickNameCell({ name, isHighlighted }: { name: string; isHighlighted: boolean }) {
    return (
        <span
            className={combineClassNames(
                'max-w-xs truncate text-gray-500',
                isHighlighted && 'font-semibold text-indigo-700',
            )}
        >
            {name}
        </span>
    );
}

function GraphRAGSearchPickDescriptionCell({ value }: { value: string }) {
    return <span className="max-w-md truncate text-gray-500">{value}</span>;
}

function GraphRAGSearchPickStateCell({ state }: { state: string }) {
    return <span className="text-gray-500">{state}</span>;
}

function GraphRAGSearchPickCreatedAtCell({ displayValue, isHighlighted }: { displayValue: string; isHighlighted: boolean }) {
    return (
        <span className={combineClassNames('text-gray-500', isHighlighted && 'font-medium text-indigo-700')}>
            {displayValue}
        </span>
    );
}

function GraphRAGSearchPickSelectCell({ isRowSelected, disabled, onSelect }: { isRowSelected: boolean; disabled: boolean; onSelect: () => void }) {
    return (
        <ButtonAsText
            text={isRowSelected ? 'Selected' : 'Select'}
            color="indigo"
            disabled={disabled}
            onClick={onSelect}
        />
    );
}

function GraphRAGOverviewStateCell({ state, errorInfo }: { state: string; errorInfo?: string }) {
    return (
        <div className="flex flex-nowrap items-center justify-start gap-x-2">
            <span className="text-gray-500">{state}</span>
            {errorInfo ? (
                <InfoButton
                    content={'Error: ' + errorInfo}
                    infoButtonSize="sm"
                    divPosition="left"
                    addClasses="max-h-52 overflow-y-auto whitespace-pre-line"
                />
            ) : null}
        </div>
    );
}

function JumpToConversationAndAssignCell({ onClick, jumpTo }) {
    return <div className="flex justify-center">
        <Tooltip content={`Assign user to the org and jump to ${jumpTo}`} color="invert" className="cursor-auto">
            <button onClick={onClick}
                className='inline-flex p-2 items-center justify-center rounded-lg hover:bg-gray-200'>
                <MemoIconArrowRight className='h-4 w-4' />
            </button>
        </Tooltip>
    </div>
}

function TaskStateCell({ value, color, tooltipValue }) {
    const className = useMemo(() => {
        return `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color === 'green'
            ? 'bg-green-300'
            : 'bg-' + color + '-100 text-' + color + '-800'}`;
    }, [color]);

    return (
        <>
            {tooltipValue ? (
                <Tooltip content={tooltipValue} color="invert" className="cursor-auto">
                    <span className={className}>
                        <svg className={`mr-1.5 h-2 w-2 ${'text-' + color + '-400'}`} fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        <span className={' text-' + color + '-800'}>{value}</span>
                    </span>
                </Tooltip>
            ) : (
                <span className={className}>
                    <svg className={`mr-1.5 h-2 w-2 ${'text-' + color + '-400'}`} fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                    </svg>
                    <span className={' text-' + color + '-800'}>{value}</span>
                </span>
            )}
        </>
    );
}

function DataBlockColumnDetailsCell({ userCreated, onClick }) {
    return <>
        {userCreated ?
            <div className="flex justify-center">
                <ButtonAsText
                    text="Details"
                    color="green"
                    iconRight={MemoIconArrowRight}
                    onClick={onClick}
                />
            </div>
            : <label className="text-gray-500 italic">Not changeable</label>}
    </>
}


export { OrganizationAndUsersCell, MaxRowsColsCharsCell, CommentsCell, ExportConsumptionAndDeleteCell, BadgeCell, NulledBadgeCell, OrganizationUserCell, DeleteCell, LevelCell, ArchiveReasonCell, ProjectNameTaskCell, CancelTaskCell, IconCell, ConfigCell, EditDeleteOrgButtonCell, ViewStackCell, AbortSessionButtonCell, FeedbackMessageCell, FeedbackMessageTextCell, JumpToConversationCell, RemoteVersionCell, ExternalLinkCell, ModelDateCell, FileSizeCell, StatusModelCell, DeleteModelCell, LabelCell, ViewCell, EvaluationRunStateCell, EvaluationRunDetailsCell, EtlApiTokenCell, EmailCell, EditIntegrationCell, ExpiredTokenCell, LinkCell, ConfigReleaseNotificationCell, TruncateAndTooltipCell, JumpToConversationAndAssignCell, TaskStateCell, DataBlockColumnDetailsCell, LightUserConfigCell, DatasetOverviewRowCheckboxCell, DatasetOverviewCreatedAtCell, DatasetOverviewDescriptionCell, DatasetOverviewActionsCell, MarkdownOverviewStateCell, MarkdownOverviewReviewedCell, MarkdownOverviewParsingScopeCell, MarkdownOverviewRunCell, MarkdownOverviewDownloadCell, MarkdownOverviewShowCell, IntegrationsOverviewStateCell, IntegrationsOverviewRefineryProjectCell, IntegrationsOverviewConfigsCell, IntegrationsOverviewEditCell, IntegrationsOverviewSyncCell, IntegrationsOverviewSharepointCell, IntegrationsOverviewShowCell, ConversationsInitialMessageCell, ConversationsCountDotCell, ConversationsShowLogsCell, ConversationsJumpToCell, EnvVarDescriptionCell, EnvVarEditCell, GraphRAGSearchPickNameCell, GraphRAGSearchPickDescriptionCell, GraphRAGSearchPickStateCell, GraphRAGSearchPickCreatedAtCell, GraphRAGSearchPickSelectCell, GraphRAGOverviewStateCell }
