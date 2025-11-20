import React from "react";
import { InboxMailThread, InboxMailThreadSupportProgressState } from "./inbox-mail/types-mail";
import { IconExternalLink, IconProgressCheck } from "@tabler/icons-react";
import KernDropdown from "./KernDropdown";


interface MetaData {
    supportOwnerName?: { first: string; last: string };
    projectId?: string;
    projectName?: string;
    conversationId?: string;
    conversationHeader?: string;
}

interface ProgressOption {
    name: string;
    value: InboxMailThreadSupportProgressState;
}

interface InboxMailAdminPanelProps {
    selectedThread: InboxMailThread;
    progressStateOptions: ProgressOption[];
    handleInboxMailProgressChange: (value: InboxMailThreadSupportProgressState) => void;
}

function InboxMailAdminPanel(props: InboxMailAdminPanelProps) {
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
                            window.open(
                                `/cognition/projects/${props.selectedThread.metaData.projectId}/pipeline`,
                                "_blank"
                            )
                        }
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
                        onClick={() =>
                            window.open(
                                `/cognition/projects/${props.selectedThread.metaData.projectId}/ui/${props.selectedThread.metaData.conversationId}`,
                                "_blank"
                            )
                        }
                    >
                        <IconExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InboxMailAdminPanel;
