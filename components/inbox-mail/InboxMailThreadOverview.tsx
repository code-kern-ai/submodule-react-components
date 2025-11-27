import { useMemo } from "react";
import { InboxMailThread, InboxMailThreadSupportProgressState } from "./types-mail";
import { IconAlertTriangle, IconCircleCheck, IconHelpCircle, IconProgressCheck, IconUser } from "@tabler/icons-react";
import { formatDisplayTimestamp } from "./helper";
import { Tooltip } from "@nextui-org/react";

interface InboxMailThreadOverviewProps {
    thread: InboxMailThread;
    isAdmin: boolean;
    selectedThread: InboxMailThread | null;
    setSelectedThread: (t: InboxMailThread) => void;
    translator: any;
};

export default function InboxMailThreadOverview(props: InboxMailThreadOverviewProps) {
    const t = useMemo(() => props.translator, [props.translator]);
    const {
        displayName,
        displayInitials,
        background,
        text,
        recipientIds,
        DisplayIcon
    } = props.thread.display;

    const unreadMailCount = useMemo(() => {
        if (props.isAdmin && props.thread.isAdminSupportThread) {
            return props.thread.metaData.unreadMailCountAdmin
        }
        else {
            return props.thread.unreadMailCount
        }
    }, [props.thread, props.isAdmin]);

    return (
        <div
            key={props.thread.id}
            className={`flex flex-col py-3 px-4 border-b border-gray-200 last:border-b-0 first:rounded-t-lg last:rounded-b-lg cursor-pointer transition-all
            ${props.selectedThread?.id === props.thread.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
            onClick={() => props.setSelectedThread(props.thread)}
        >
            <div className="flex items-center space-x-4">

                {!props.thread.isAdminSupportThread || props.isAdmin ? (
                    <div
                        style={{ backgroundColor: background, color: text }}
                        className="self-start shrink-0 mt-1 flex items-center justify-center w-10 h-10 border rounded-md p-2 text-sm font-semibold relative"
                    >
                        {displayInitials || <DisplayIcon /> || <IconUser />}
                        {recipientIds?.length > 1 && (
                            <div className="absolute -bottom-0.5 -right-0.5 bg-gray-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                {recipientIds.length}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="self-start shrink-0 mt-1 flex items-center justify-center w-10 h-10 border rounded-md p-2 text-sm font-semibold bg-[#18181B]">
                        <img className="h-8 w-auto" src="/cognition/kernai.svg" alt="Kern AI" />
                    </div>
                )}

                <div className="grow min-w-0">
                    <div className="flex items-start justify-between gap-x-2 flex-nowrap">
                        <div className="flex items-center">
                            <div className="text-gray-800 font-medium truncate mt-0.5">
                                {displayName ?? `<${t("inboxMail.unknownUser")}>`}
                            </div>
                            {unreadMailCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center bg-slate-400 text-white text-[0.625rem] font-semibold rounded-full h-4 min-w-4 px-1.5 whitespace-nowrap">
                                    {unreadMailCount} {t("inboxMail.newBadge")}
                                </span>
                            )}
                        </div>
                        <div className="flex ml-auto items-center gap-x-2 flex-wrap gap-y-2 justify-end">
                            <div className={` ${(props.thread.isAdminSupportThread || props.thread.isImportant || props.thread.progressState === InboxMailThreadSupportProgressState.IN_PROGRESS) ? "flex" : "hidden"} items-center gap-x-2 bg-slate-100/70 py-1 px-2 rounded-full`}>
                                {props.thread.isAdminSupportThread && (
                                    <Tooltip
                                        content={t("inboxMail.supportRequest")}
                                        placement="top"
                                        color="invert"
                                        className="cursor-help"
                                    >
                                        <IconHelpCircle className="h-[1.125rem] w-auto text-red-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.isImportant && (
                                    <Tooltip content={t("inboxMail.highPriority")} placement="top" color="invert" className="cursor-help">
                                        <IconAlertTriangle className="h-[1.125rem] w-auto text-orange-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.progressState === InboxMailThreadSupportProgressState.IN_PROGRESS && (
                                    <Tooltip content={t("inboxMail.inProgress")} placement="top" color="invert" className="cursor-help">
                                        <IconProgressCheck className="h-[1.125rem] w-auto text-orange-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.progressState === InboxMailThreadSupportProgressState.RESOLVED && (
                                    <Tooltip content={t("inboxMail.resolved")} placement="top" color="invert" className="cursor-help">
                                        <IconCircleCheck className="h-[1.125rem] w-auto text-green-600 mb-0.5" />
                                    </Tooltip>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 whitespace-nowrap ml-2 shrink-0 py-1.5">
                                {formatDisplayTimestamp(props.thread.latestMail?.createdAt)}
                            </div>
                        </div>
                    </div>

                    <div className="text-gray-800 font-medium truncate min-h-[1.5rem]">
                        {props.thread.subject}
                    </div>
                    <div className="text-gray-500 truncate min-h-[1.5rem]">
                        {props.thread.latestMail?.content}
                    </div>
                </div>
            </div>
        </div>
    );
}