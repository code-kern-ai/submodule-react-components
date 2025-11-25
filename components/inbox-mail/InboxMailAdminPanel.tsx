import React, { useCallback } from "react";
import { InboxMailThread, InboxMailThreadSupportProgressState, User } from "./types-mail";
import { IconExternalLink, IconProgressCheck } from "@tabler/icons-react";
import KernDropdown from "../KernDropdown";
import { addUserToOrganization, removeUserFromOrganization } from "./service-mail";

interface ProgressOption {
    name: string;
    value: InboxMailThreadSupportProgressState;
}

interface InboxMailAdminPanelProps {
    selectedThread: InboxMailThread;
    progressStateOptions: ProgressOption[];
    handleInboxMailProgressChange: (value: InboxMailThreadSupportProgressState) => void;
    currentUser: User;
}

function InboxMailAdminPanel(props: InboxMailAdminPanelProps) {
    // No translations needed, admin only
    const assignAndJump = useCallback((toConversation: boolean) => {
        if (!props.currentUser) return;
        const currentOrganizationId = props.currentUser?.organizationId;
        if (!currentOrganizationId) {
            addUserToOrganization(props.currentUser.mail, props.selectedThread.organizationName, (res) => {
                jumptoConversationOrProject(toConversation);

            });
        } else if (currentOrganizationId === props.selectedThread.organizationId) {
            jumptoConversationOrProject(toConversation);

        } else {
            removeUserFromOrganization(props.currentUser.mail, (res) => {
                addUserToOrganization(props.currentUser.mail, props.selectedThread.organizationName, (res) => {
                    jumptoConversationOrProject(toConversation);
                });
            });
        }
    }, [props.currentUser, props.selectedThread]);

    const jumptoConversationOrProject = useCallback((toConversation: boolean) => {
        if (toConversation) {
            window.open(`/cognition/projects/${props.selectedThread.metaData?.projectId}/ui/${props.selectedThread.metaData?.conversationId}`, '_blank');
        }
        else {
            window.open(`/cognition/projects/${props.selectedThread.metaData.projectId}/pipeline`, '_blank');
        }
    }, [props.selectedThread.metaData]);

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
                        {props.selectedThread.metaData.supportOwnerName.first}{" "}
                        {props.selectedThread.metaData.supportOwnerName.last}
                    </div>
                )}
            </div>

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
                        onClick={() =>
                            assignAndJump(false)
                        }
                    >
                        <IconExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )
            }

            {
                props.selectedThread.metaData?.conversationId && (
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
                            onClick={() => assignAndJump(true)}
                        >
                            <IconExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default InboxMailAdminPanel;
