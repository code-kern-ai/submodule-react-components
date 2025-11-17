
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail, InboxMailThread, User } from "./types-mail";
import { getInboxMailOverviewByThreadsPaginated, getInboxMailsByThread, createInboxMailByThread } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus } from "../kern-icons/icons";
import { IconUser, IconTrash, IconAlertTriangle, IconHelpCircle } from "@tabler/icons-react";
import { Tooltip } from "@nextui-org/react";
import useRefState from "../../hooks/useRefState";
import { MAIL_LIMIT_PER_PAGE, prepareThreadDisplayData, formatDisplayTimestamp, formatDisplayTimestampFull, uuidToPastelColorWithMatchingFont } from "./helper";



export default function InboxMailView(props: { currentUser, orgUsers }) {
    const [inboxMailThreads, setInboxMailThreads] = useState<InboxMailThread[]>([]);
    const [openCreateMail, setOpenCreateMail] = useState(false);
    const [isNewThread, setIsNewThread] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedThread, setSelectedThread] = useState<InboxMailThread>(null);
    const [threadMails, setThreadMails] = useState<InboxMail[]>([]);
    const { state: isAdminSupportThread, setState: setIsAdminSupportThread, ref: isAdminSupportThreadRef } = useRefState(false);

    const isAdmin = useMemo(() => {
        return props.currentUser?.isAdmin
    }, [props.currentUser]);

    useEffect(() => {
        refetchInboxMailOverview();
    }, []);

    const refetchInboxMailOverview = useCallback(() => {
        getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) =>
            setInboxMailThreads(res.threads));
    }, [currentPage]);

    const refetchSelectedThreadMails = useCallback(() => {
        if (!selectedThread) return;
        getInboxMailsByThread(selectedThread.id, (res) => {
            setThreadMails(res);
        });
    }, [selectedThread]);

    const handleInboxMailCreation = useCallback((content: string, recipientIds?: string[], subject?: string, markAsImportant?: boolean, metaData?: any) => {
        createInboxMailByThread(content, (result) => {
            setOpenCreateMail(false);
            getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) => {
                if (isNewThread && res.threads.length > 0) {
                    setSelectedThread(res.threads.find((thread) => thread.id === result.threadId));
                }
                setInboxMailThreads(res.threads);
            });
            if (selectedThread && !isNewThread) {
                refetchSelectedThreadMails();
            }
        }, recipientIds, subject, markAsImportant, metaData, isNewThread ? undefined : selectedThread?.id, isAdminSupportThreadRef.current);
    }, [isNewThread, refetchSelectedThreadMails, selectedThread, currentPage]);

    useEffect(() => {
        refetchSelectedThreadMails();
    }, [selectedThread]);

    const preparedThreads = useMemo(
        () => inboxMailThreads.map(t => ({
            ...t,
            display: prepareThreadDisplayData(t, props.currentUser, isAdmin)
        })),
        [inboxMailThreads, props.currentUser, isAdmin]
    )

    if (!props.currentUser) return;

    return (
        <div className='flex flex-col pt-16 h-screen overflow-hidden'>
            <div className="flex items-center w-full justify-between mb-2 px-4 py-2 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold">
                            Inbox Mail
                        </h2>
                        <p>
                            Manage your inbox messages.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <KernButton
                        text="New issue"
                        icon={IconHelpCircle}
                        iconColor="red"
                        onClick={() => {
                            setIsNewThread(true);
                            setOpenCreateMail(true);
                            setIsAdminSupportThread(true);
                        }} />
                    <KernButton
                        text="New mail"
                        iconColor="green"
                        icon={MemoIconPlus}
                        onClick={() => {
                            setIsNewThread(true);
                            setOpenCreateMail(true);
                            setIsAdminSupportThread(false);
                        }} />

                </div>
            </div>

            {inboxMailThreads?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="text-2xl font-semibold mb-4">No Inbox Mails</div>
                    <div className="text-gray-500 mb-6">You have no mails in your inbox</div>
                </div>
            ) : <div className="grid grid-cols-3 gap-x-4 p-3 overflow-hidden">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-lg ">
                        {preparedThreads.map((threadOverview: InboxMailThread) => (
                            <ThreadOverview
                                key={threadOverview.id}
                                thread={threadOverview}
                                isAdmin={isAdmin}
                                selectedThread={selectedThread}
                                setSelectedThread={setSelectedThread}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-span-2 overflow-y-auto pr-2 pb-12 ">
                    {selectedThread && threadMails && threadMails.length > 0 ? (
                        <>
                            {threadMails.map((mail: InboxMail) => (
                                <ThreadMailItem
                                    key={mail.id}
                                    mail={mail}
                                    onDelete={() => { }}
                                />
                            ))}
                            <div>
                                <KernButton
                                    className="ml-auto"
                                    text="Reply"
                                    onClick={() => {
                                        setIsNewThread(false);
                                        setOpenCreateMail(true);
                                        setIsAdminSupportThread(selectedThread.isAdminSupportThread);
                                    }}
                                />
                            </div>
                        </>
                    )
                        : <div className="flex flex-col items-center justify-center mt-20">
                            <div className="text-gray-500 mb-6">Select mail to see the details</div>
                        </div>}
                </div>
            </div>}
            <CreateNewMailModal isAdminSupportThread={isAdminSupportThread} open={openCreateMail} setOpen={setOpenCreateMail} thread={selectedThread} isNewThread={isNewThread} handleInboxMailCreation={handleInboxMailCreation} users={props.orgUsers} currentUser={props.currentUser} />
        </div >

    )
}

interface ThreadProps {
    thread: InboxMailThread;
    isAdmin: boolean;
    selectedThread: InboxMailThread | null;
    setSelectedThread: (t: InboxMailThread) => void;
};

function ThreadOverview(props: ThreadProps) {
    const {
        displayName,
        displayInitials,
        background,
        text,
        recipientIds
    } = props.thread.display;

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
                        {displayInitials ?? <IconUser />}
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
                    <div className="flex items-center justify-between gap-x-2 flex-nowrap">
                        <div className="text-gray-800 font-medium truncate">
                            {displayName ?? "<Unknown User>"}
                        </div>

                        <div className="flex ml-auto items-center gap-x-1">
                            {props.thread.isAdminSupportThread && (
                                <Tooltip
                                    content={props.isAdmin ? "This mail is a support request from a user" : "This mail is between you and the KernAI support"}
                                    placement="top"
                                    color="invert"
                                >
                                    <IconHelpCircle className="h-[1.125rem] w-auto text-red-600 mb-0.5" />
                                </Tooltip>
                            )}
                            {props.thread.isImportant && (
                                <Tooltip content="This mail is marked as important" placement="top" color="invert">
                                    <IconAlertTriangle className="h-[1.125rem] w-auto text-orange-600 mb-0.5" />
                                </Tooltip>
                            )}
                            <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {formatDisplayTimestamp(props.thread.latestMail.createdAt)}
                            </div>
                        </div>
                    </div>

                    <div className="text-gray-800 font-medium truncate">
                        {props.thread.subject}
                    </div>

                    <div className="text-gray-500 truncate">
                        {props.thread.latestMail.content}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ThreadMailItemProps {
    mail: InboxMail;
    onDelete?: (id: string) => void;
}

function ThreadMailItem(props: ThreadMailItemProps) {
    return (
        <div className="py-3 px-4 mb-2 border border-gray-300 rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between text-sm">
                <div className="grow min-w-0">
                    <div className="flex items-center justify-between gap-x-2 flex-nowrap">
                        <span className="font-medium text-gray-700">
                            {props.mail.senderName?.first} {props.mail.senderName?.last}
                        </span>

                        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                            {formatDisplayTimestampFull(props.mail.createdAt)}
                        </span>
                    </div>

                    <span className="text-sm text-gray-500">
                        To: {props.mail.recipientNames.map((name) => `${name.first} ${name.last}`).join(", ")}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-2 pt-2 text-gray-700 whitespace-pre-line break-words">
                {props.mail.content}
            </div>

            <div className="mt-2 flex items-center justify-end space-x-3">
                <KernButton
                    icon={IconTrash}
                    onClick={() => props.onDelete?.(props.mail.id)}
                />
            </div>
        </div>
    );
}