import React, { useCallback, useEffect, useState } from "react";
import { InboxMailThread, InboxMailThreadSupportProgressState, JumpDestination, User } from "./types-mail";
import { IconExternalLink, IconProgressCheck, IconAlertTriangle } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { addUserToOrganization, removeUserFromOrganization, updateInboxMailThreadsUnreadByContent, updateInboxMailThreadsUnreadByProject, updateInboxMailThreadUnreadLast, deleteInboxMailThreadsSimilar } from "./service-mail";
import { Tooltip } from "@nextui-org/react";
import KernButton from "../kern-button/KernButton";


interface ProgressOption {
    name: string;
    value: InboxMailThreadSupportProgressState;
}

interface InboxMailAdminPanelProps {
    selectedThread: InboxMailThread;
    progressStateOptions: ProgressOption[];
    handleInboxMailProgressChange: (value: InboxMailThreadSupportProgressState) => void;
    currentUser: User;
    refetchInboxMailOverview: () => void;
    translator: (key: string) => string;
}

function InboxMailAdminPanel(props: InboxMailAdminPanelProps) {
    const t = props.translator;
    const [canMarkLastUnread, setCanMarkLastUnread] = useState(true);

    useEffect(() => {
        if (props.selectedThread.metaData?.unreadMailCountAdmin > 0) {
            setCanMarkLastUnread(false);
        } else {
            setCanMarkLastUnread(true);
        }
    }, [props.selectedThread.id, props.selectedThread.metaData?.unreadMailCountAdmin]);

    const assignAndJump = useCallback((destination: JumpDestination) => {
        if (!props.currentUser) return;
        const currentOrganizationId = props.currentUser?.organizationId;
        if (!currentOrganizationId) {
            addUserToOrganization(props.currentUser.mail, props.selectedThread.organizationName, (res) => {
                jumpTo(destination);
            });
        } else if (currentOrganizationId === props.selectedThread.organizationId) {
            jumpTo(destination);
        } else {
            removeUserFromOrganization(props.currentUser.mail, (res) => {
                addUserToOrganization(props.currentUser.mail, props.selectedThread.organizationName, (res) => {
                    jumpTo(destination);
                });
            });
        }
    }, [props.currentUser, props.selectedThread]);

    const jumpTo = useCallback((destination: JumpDestination) => {
        switch (destination) {
            case JumpDestination.CONVERSATION:
                window.open(`/cognition/projects/${props.selectedThread.metaData?.projectId}/ui/${props.selectedThread.metaData?.conversationId}`, '_blank');
                break;
            case JumpDestination.PROJECT:
                window.open(`/cognition/projects/${props.selectedThread.metaData?.projectId}/pipeline`, '_blank');
                break;
            case JumpDestination.ORGANIZATION:
                window.open('/cognition', '_blank');
                break;
        }
    }, [props.selectedThread.metaData]);


    const handleSameContentRead = useCallback(() => {
        updateInboxMailThreadsUnreadByContent(props.selectedThread.id, (res) => {
            props.refetchInboxMailOverview();
        });
    }, [props.selectedThread?.id, props.refetchInboxMailOverview]);

    const handleSameProjectRead = useCallback(() => {
        updateInboxMailThreadsUnreadByProject(props.selectedThread.id, (res) => {
            props.refetchInboxMailOverview();
        });
    }, [props.selectedThread?.id, props.refetchInboxMailOverview]);

    const handleMarkLastUnread = useCallback(() => {
        setCanMarkLastUnread(false);
        updateInboxMailThreadUnreadLast(props.selectedThread.id, (res) => {
            props.refetchInboxMailOverview();
        });
    }, [props.selectedThread?.id, props.refetchInboxMailOverview]);

    const handleDeleteSimilar = useCallback(() => {
        if (!confirm("Are you sure you want to delete all similar inbox mails? This action cannot be undone.")) return;
        deleteInboxMailThreadsSimilar(props.selectedThread.id, (res) => props.refetchInboxMailOverview());
    }, [props.selectedThread?.id, props.refetchInboxMailOverview]);

    return (
        <div>
            <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-1 mb-2 mt-1 overflow-y-visible z-10">
                    <span className="text-sm font-medium mr-2">Progress:</span>
                    <KernDropdown
                        dropdownWidth="w-40"
                        buttonName={
                            props.progressStateOptions.find(
                                (option) => option.value === props.selectedThread.progressState
                            )?.name || "Set progress"
                        }
                        options={props.progressStateOptions}
                        selectedOption={(option: { label: string; value: InboxMailThreadSupportProgressState }) =>
                            props.handleInboxMailProgressChange(option.value)
                        }
                    />
                </div>
                {props.selectedThread.progressState !== InboxMailThreadSupportProgressState.PENDING && props.selectedThread.metaData?.supportOwnerName && (
                    <div className="bg-orange-400 text-white rounded-full px-2 py-0.5 text-xs flex items-center gap-x-2 ml-2">
                        <IconProgressCheck className="w-5 h-5" />
                        {props.selectedThread.metaData.supportOwnerName?.first}{" "}
                        {props.selectedThread.metaData.supportOwnerName?.last}
                    </div>
                )}
                <div className="flex items-center gap-3 ml-auto my-2 px-3 py-1">
                    {props.selectedThread?.metaData?.autoGenerated && (
                        <>
                            <KernButton
                                text={t("inboxMail.readAllByError")}
                                onClick={handleSameContentRead}
                            />
                            <KernButton
                                text={t("inboxMail.readAllByProject")}
                                onClick={handleSameProjectRead}
                            />
                        </>
                    )}
                    <KernButton
                        text={t("inboxMail.markLastUnread")}
                        onClick={handleMarkLastUnread}
                        disabled={!canMarkLastUnread}
                    />
                    {props.selectedThread?.metaData?.autoGenerated && (
                        <Tooltip
                            content={<div className="w-52">{t("inboxMail.deleteAllByContentTooltip")}</div>}
                            placement="top"
                            color="invert"
                        >
                            <KernButton
                                text={t("inboxMail.deleteAllByContent")}
                                onClick={handleDeleteSimilar}
                                icon={() => <IconAlertTriangle className="w-4 h-4 text-red-500" />}
                            />
                        </Tooltip>
                    )}
                </div>
            </div>
            {props.selectedThread.organizationId && (
                <div className="flex items-center gap-3 ml-2 my-2 px-3 py-1 rounded-xl bg-indigo-400/60 text-white w-fit">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold">Organization</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs bg-indigo-400 px-2 py-0.5 rounded-md">
                        <span>ID:</span>
                        <span>{props.selectedThread.organizationId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-indigo-400 px-2 py-0.5 rounded-md">
                        <span>{props.selectedThread.organizationName}</span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 text-xs bg-indigo-400 px-2 py-0.5 rounded-md"
                        onClick={() => assignAndJump(JumpDestination.ORGANIZATION)}
                    >
                        <IconExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )}

            {props.selectedThread.metaData?.projectId && (
                <div className="flex items-center gap-3 ml-2 my-2 px-3 py-1 rounded-xl bg-slate-400/60 text-white w-fit">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold">Project</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs bg-slate-400 px-2 py-0.5 rounded-md">
                        <span>ID:</span>
                        <span>{props.selectedThread.metaData.projectId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-slate-400 px-2 py-0.5 rounded-md">
                        <span>{props.selectedThread.metaData.projectName}</span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 text-xs bg-slate-400 px-2 py-0.5 rounded-md"
                        onClick={() => assignAndJump(JumpDestination.PROJECT)}
                    >
                        <IconExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )}

            {props.selectedThread.metaData?.conversationId && (
                <div className="flex items-center gap-3 ml-2 my-2 px-3 py-1 rounded-xl bg-gray-400/60 text-white w-fit">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold">Conversation</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs bg-gray-400 px-2 py-0.5 rounded-md">
                        <span>ID:</span>
                        <span>{props.selectedThread.metaData.conversationId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-gray-400 px-2 py-0.5 rounded-md">
                        <span>{props.selectedThread.metaData.conversationHeader || "N/A"}</span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 text-xs bg-gray-400 px-2 py-0.5 rounded-md"
                        onClick={() => assignAndJump(JumpDestination.CONVERSATION)}
                    >
                        <IconExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div >
    );
};

export default InboxMailAdminPanel;
