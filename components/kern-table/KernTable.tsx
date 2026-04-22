import SortArrows from "@/submodules/react-components/components/kern-table/SortArrows";
import Pagination from "@/submodules/react-components/components/pagination/Pagination";
import { combineClassNames } from "@/submodules/javascript-functions/general";
import { KernTableProps } from "../../types/kern-table";
import { AbortSessionButtonCell, ArchiveReasonCell, BadgeCell, CancelTaskCell, CommentsCell, ConfigCell, ConfigReleaseNotificationCell, ConversationsCountDotCell, ConversationsInitialMessageCell, ConversationsJumpToCell, ConversationsShowLogsCell, DataBlockColumnDetailsCell, DatasetOverviewActionsCell, DatasetOverviewCreatedAtCell, DatasetOverviewDescriptionCell, DatasetOverviewRowCheckboxCell, DeleteCell, DeleteModelCell, EditDeleteOrgButtonCell, EditIntegrationCell, EmailCell, EnvVarDescriptionCell, EnvVarEditCell, EtlApiTokenCell, EvaluationRunDetailsCell, EvaluationRunStateCell, ExpiredTokenCell, ExportConsumptionAndDeleteCell, ExternalLinkCell, FeedbackMessageCell, FeedbackMessageTextCell, FileSizeCell, GraphRAGOverviewStateCell, GraphRAGSearchPickCreatedAtCell, GraphRAGSearchPickDescriptionCell, GraphRAGSearchPickNameCell, GraphRAGSearchPickSelectCell, GraphRAGSearchPickStateCell, IconCell, IntegrationsOverviewConfigsCell, IntegrationsOverviewEditCell, IntegrationsOverviewRefineryProjectCell, IntegrationsOverviewSharepointCell, IntegrationsOverviewShowCell, IntegrationsOverviewStateCell, IntegrationsOverviewSyncCell, JumpToConversationAndAssignCell, JumpToConversationCell, LabelCell, LevelCell, LightUserConfigCell, LinkCell, MaxRowsColsCharsCell, ModelDateCell, NulledBadgeCell, OrganizationAndUsersCell, OrganizationUserCell, ProjectNameTaskCell, RemoteVersionCell, StatusModelCell, TaskStateCell, TruncateAndTooltipCell, ViewCell, ViewStackCell } from "./CellComponents";
import { Fragment, useMemo } from "react";
import KernDropdown from "../KernDropdown";
import { NotApplicableBadge } from "@/submodules/react-components/components/Badges";
import { Tooltip } from "@nextui-org/react";
import MultilineTooltipAutoContent from "@/submodules/react-components/components/MultilineTooltipAuto";
import { NoTableEntriesYet } from "../NoTableEntriesYet";
import { MemoIconCell, MemoIconClick, MemoIconEdit } from "../kern-icons/icons";
import SortArrowsIdx from "./SortArrowsIdx";

export default function KernTable(props: KernTableProps) {
    const legacy = props.config?.specificDesign === true;
    const length = useMemo(() => props.headers?.length || 5, [props.headers?.length]);


    const onClickSortLookup = useMemo(() => {
        if (!props.headers) return undefined;
        const x = props.headers.map((header, idx) => {
            if (!header.hasSort) return undefined;
            if (!props.config) return undefined;
            if (props.config.sortKey != null && props.config.onClickSort != null) return () => props.config.onClickSort(header.id);
            if (props.config.sortKeyIdx != null && props.config.onClickSortIdx != null) return () => props.config.onClickSortIdx(idx);
            throw new Error("KernTable: No onClickSort or onClickSortIdx provided in config for sortable header: " + header.id);
            return undefined;
        })
        return x;
    }, [props.headers, props.config]);

    const sortArrowLookup = useMemo(() => {
        if (!props.headers) return undefined;
        return props.headers.map((header, idx) => {
            if (!props.config || (props.config.sortKeyIdx == null && props.config.sortKey == null)) return undefined;
            if (!header.hasSort) return undefined;
            if (props.config.sortKey) return <SortArrows sortKey={props.config.sortKey} property={header.id} />;
            if (props.config.sortKeyIdx) return <SortArrowsIdx sortKey={props.config.sortKeyIdx} idx={idx} />;
            return undefined;
        })
    }, [props.config, props.headers])

    return (
        <>
            <table className={combineClassNames(
                'min-w-full divide-y divide-gray-300',
                legacy && 'table-fixed',
                !legacy && 'rounded-b-lg',
                props.config?.addBorder && 'border border-gray-300',
            )}>
                <thead className={legacy ? '' : 'bg-gray-50'}>
                    <tr>
                        {props.headers.map((header, idx) => (
                            <th scope="col"
                                className={combineClassNames(
                                    header.hasCheckboxes && legacy && 'px-3 py-4',
                                    header.hasCheckboxes && !legacy && 'px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500',
                                    !header.hasCheckboxes && legacy && 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900',
                                    !header.hasCheckboxes && !legacy && 'px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500',
                                    header.hasSort && 'cursor-pointer hover:text-gray-700',
                                )}
                                id={header.id} key={header.id}
                                onClick={onClickSortLookup[idx]}
                            >
                                {header.hasCheckboxes ? (
                                    legacy ? (
                                        <div className="relative px-7 sm:w-12 sm:px-6">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                checked={header.checked}
                                                onChange={header.onChange}
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            checked={header.checked}
                                            onChange={header.onChange}
                                        />
                                    )
                                ) : <div className={combineClassNames('inline-flex flex-row items-center', !legacy && 'w-full justify-center')}>
                                    {!header.tooltip ? header.column :
                                        <div className={combineClassNames('flex w-full', legacy ? 'justify-start' : 'justify-center')}>
                                            <Tooltip
                                                content={<MultilineTooltipAutoContent tooltip="True positives / (True positives + False positives)\nfor the reference data you labeled" splitOn="\n" />}
                                                color="invert"
                                                placement="top">Est. Precision</Tooltip>
                                        </div>}
                                    {sortArrowLookup[idx]}
                                </div>}
                            </th>))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {props.values?.length === 0 && props.config?.noEntriesText && <NoTableEntriesYet tableColumns={length} text={props.config.noEntriesText} marginBottomClass='-mb-4' />}
                    {props.values?.map((row, index) => (
                        <tr key={index} className={legacy ? 'bg-white' : (index % 2 != 0 ? "bg-gray-50" : "bg-white")}>
                            {row.map((cell, index) => {
                                return <Fragment key={index}>
                                    <td className={combineClassNames(
                                        'text-sm text-gray-500',
                                        legacy ? 'px-3 py-4 text-left' : 'px-3 py-2 text-center',
                                        props.headers[index].wrapWhitespace ? 'whitespace-normal' : 'whitespace-nowrap',
                                    )}>
                                        <div className={combineClassNames(
                                            'flex flex-row items-center gap-x-2',
                                            legacy ? 'justify-start' : 'justify-center',
                                        )}>
                                            <ComponentMapper {...cell} />
                                            {cell.editFunction ? cell.useClickIcon ? <MemoIconClick className="h-5 w-5 text-gray-500 cursor-pointer" onClick={cell.editFunction} /> : <MemoIconEdit className="h-5 w-5 text-gray-500 cursor-pointer" onClick={cell.editFunction} /> : null}
                                        </div>
                                    </td>
                                </Fragment>
                            })}
                        </tr>))}
                </tbody>
            </table>
            {props.pagination ? <Pagination {...props.pagination} /> : null}
        </>
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
                case 'NulledBadgeCell':
                    return <NulledBadgeCell {...cell} />;
                case 'OrganizationUserCell':
                    return <OrganizationUserCell {...cell} />;
                case 'DeleteCell':
                    return <DeleteCell {...cell} />;
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
                case 'FeedbackMessageCell':
                    return <FeedbackMessageCell {...cell} />;
                case 'FeedbackMessageTextCell':
                    return <FeedbackMessageTextCell {...cell} />;
                case 'JumpToConversationCell':
                    return <JumpToConversationCell {...cell} />;
                case 'RemoteVersionCell':
                    return <RemoteVersionCell {...cell} />;
                case 'ExternalLinkCell':
                    return <ExternalLinkCell {...cell} />;
                case 'ModelDateCell':
                    return <ModelDateCell {...cell} />;
                case 'FileSizeCell':
                    return <FileSizeCell {...cell} />;
                case 'StatusModelCell':
                    return <StatusModelCell {...cell} />;
                case 'DeleteModelCell':
                    return <DeleteModelCell {...cell} />;
                case 'LabelCell':
                    return <LabelCell {...cell} />;
                case 'ViewCell':
                    return <ViewCell {...cell} />;
                case 'EvaluationRunStateCell':
                    return <EvaluationRunStateCell {...cell} />;
                case 'EvaluationRunDetailsCell':
                    return <EvaluationRunDetailsCell {...cell} />;
                case 'EtlApiTokenCell':
                    return <EtlApiTokenCell {...cell} />;
                case 'LightUserConfigCell':
                    return <LightUserConfigCell {...cell} />;
                case 'EmailCell':
                    return <EmailCell {...cell} />;
                case 'EditIntegrationCell':
                    return <EditIntegrationCell {...cell} />;
                case 'ExpiredTokenCell':
                    return <ExpiredTokenCell  {...cell} />;
                case 'LinkCell':
                    return <LinkCell  {...cell} />;
                case 'ConfigReleaseNotificationCell':
                    return <ConfigReleaseNotificationCell  {...cell} />;
                case 'TruncateAndTooltipCell':
                    return <TruncateAndTooltipCell {...cell} />;
                case 'JumpToConversationAndAssignCell':
                    return <JumpToConversationAndAssignCell {...cell} />;
                case 'TaskStateCell':
                    return <TaskStateCell {...cell} />;
                case 'DataBlockColumnDetailsCell':
                    return <DataBlockColumnDetailsCell {...cell} />;
                case 'DatasetOverviewRowCheckboxCell':
                    return <DatasetOverviewRowCheckboxCell {...cell} />;
                case 'DatasetOverviewCreatedAtCell':
                    return <DatasetOverviewCreatedAtCell {...cell} />;
                case 'DatasetOverviewDescriptionCell':
                    return <DatasetOverviewDescriptionCell {...cell} />;
                case 'DatasetOverviewActionsCell':
                    return <DatasetOverviewActionsCell {...cell} />;
                case 'IntegrationsOverviewStateCell':
                    return <IntegrationsOverviewStateCell {...cell} />;
                case 'IntegrationsOverviewRefineryProjectCell':
                    return <IntegrationsOverviewRefineryProjectCell {...cell} />;
                case 'IntegrationsOverviewConfigsCell':
                    return <IntegrationsOverviewConfigsCell {...cell} />;
                case 'IntegrationsOverviewEditCell':
                    return <IntegrationsOverviewEditCell {...cell} />;
                case 'IntegrationsOverviewSyncCell':
                    return <IntegrationsOverviewSyncCell {...cell} />;
                case 'IntegrationsOverviewSharepointCell':
                    return <IntegrationsOverviewSharepointCell {...cell} />;
                case 'IntegrationsOverviewShowCell':
                    return <IntegrationsOverviewShowCell {...cell} />;
                case 'ConversationsInitialMessageCell':
                    return <ConversationsInitialMessageCell {...cell} />;
                case 'ConversationsCountDotCell':
                    return <ConversationsCountDotCell {...cell} />;
                case 'ConversationsShowLogsCell':
                    return <ConversationsShowLogsCell {...cell} />;
                case 'ConversationsJumpToCell':
                    return <ConversationsJumpToCell {...cell} />;
                case 'EnvVarDescriptionCell':
                    return <EnvVarDescriptionCell {...cell} />;
                case 'EnvVarEditCell':
                    return <EnvVarEditCell {...cell} />;
                case 'GraphRAGSearchPickNameCell':
                    return <GraphRAGSearchPickNameCell {...cell} />;
                case 'GraphRAGSearchPickDescriptionCell':
                    return <GraphRAGSearchPickDescriptionCell {...cell} />;
                case 'GraphRAGSearchPickStateCell':
                    return <GraphRAGSearchPickStateCell {...cell} />;
                case 'GraphRAGSearchPickCreatedAtCell':
                    return <GraphRAGSearchPickCreatedAtCell {...cell} />;
                case 'GraphRAGSearchPickSelectCell':
                    return <GraphRAGSearchPickSelectCell {...cell} />;
                case 'GraphRAGOverviewStateCell':
                    return <GraphRAGOverviewStateCell {...cell} />;
                case '@provided@':
                    return cell.jsx ?? <NotApplicableBadge />;
            }
        case 'text':
            return <span>{cell.value ?? <NotApplicableBadge />}</span>
        case 'number':
            return <span>{cell.value[1] ?? <NotApplicableBadge />}</span>
        case 'boolean':
            return <input type="checkbox" value={cell.value} checked={cell.checked} onClick={cell.valueChange ? cell.valueChange : undefined} readOnly />
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