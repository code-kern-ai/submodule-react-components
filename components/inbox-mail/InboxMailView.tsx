
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail, InboxMailThread, User, InboxMailThreadSupportProgressState } from "./types-mail";
import { getInboxMailOverviewByThreadsPaginated, getInboxMailsByThread, createInboxMailByThread, updateInboxMailThreadProgress, deleteInboxMailById } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus } from "../kern-icons/icons";
import { IconUser, IconTrash, IconAlertTriangle, IconHelpCircle, IconProgressCheck, IconRefresh, IconCircleCheck } from "@tabler/icons-react";
import { Tooltip } from "@nextui-org/react";
import useRefState from "../../hooks/useRefState";
import { MAIL_LIMIT_PER_PAGE, prepareThreadDisplayData, formatDisplayTimestamp, formatDisplayTimestampFull, useLocalTranslation } from "./helper";
import KernDropdown from "../KernDropdown";
import useEnumOptionsTranslated, { getEnumOptionsForLanguage } from "../../hooks/enums/useEnumOptionsTranslated";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getUsers, getUserInfoExtended, getIsAdmin, getAllOrganizations } from "./service-mail";
import Pagination from "../pagination/Pagination";

export default function InboxMailView(props: { InboxMailHeader, translatorScope }) {

    const t = props.translatorScope?.translator;
    const [inboxMailThreads, setInboxMailThreads] = useState<InboxMailThread[]>([]);
    const [openCreateMail, setOpenCreateMail] = useState(false);
    const [isNewThread, setIsNewThread] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [fullCount, setFullCount] = useState(0);
    const [selectedThread, setSelectedThread] = useState<InboxMailThread>(null);
    const [threadMails, setThreadMails] = useState<InboxMail[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { state: isAdminSupportThread, setState: setIsAdminSupportThread, ref: isAdminSupportThreadRef } = useRefState(false);
    const progressStateOptions =
        props.translatorScope?.type === "local"
            ? getEnumOptionsForLanguage(
                InboxMailThreadSupportProgressState,
                "InboxMailThreadSupportProgressState",
                t,
                "en"
            )
            : props.translatorScope?.type === "i18n" ? useEnumOptionsTranslated(
                InboxMailThreadSupportProgressState,
                "InboxMailThreadSupportProgressState",
                "enums"
            ) : [];

    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState<User[]>([]);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        getUserInfoExtended(res => {
            setCurrentUser(res);
        });
        getIsAdmin((isAdmin) => setIsAdmin(isAdmin));
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        getAllOrganizations((res) => {
            setOrganizations(res);
        });
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin === undefined) return;
        if (isAdmin) {
            getUsers((res) => setUsers(res), false, false, selectedOrganization?.id);
        } else {
            getUsers((res) => setUsers(res), false, true);
        }
    }, [isAdmin, selectedOrganization]);

    useEffect(() => {
        refetchInboxMailOverview();
    }, [currentPage]);

    useEffect(() => {
        if (!selectedThread?.id) return
        refetchSelectedThreadMails();
        if (selectedThread.unreadMailCount > 0) {
            setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? { ...t, unreadMailCount: 0 } : t));
        }
        if (selectedThread.isAdminSupportThread && isAdmin && selectedThread.metaData?.unreadMailCountAdmin > 0) {
            setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? {
                ...t,
                metaData: {
                    ...t.metaData,
                    unreadMailCountAdmin: 0
                }
            } : t));
        }
    }, [selectedThread?.id]);

    const refetchInboxMailOverview = useCallback(() => {
        getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) => {
            setInboxMailThreads(res.threads);
            setFullCount(res?.totalThreads);
        });
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

    const handleInboxMailProgressChange = useCallback((progressState: InboxMailThreadSupportProgressState) => {
        if (!selectedThread) return;
        updateInboxMailThreadProgress(selectedThread.id, progressState, () => {
            setSelectedThread({
                ...selectedThread,
                progressState: progressState
            });
            setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? { ...t, progressState: progressState } : t));
        });
    }, [selectedThread]);

    const refreshIconFn = useCallback(
        () => (
            <IconRefresh
                className={refreshing ? "animate-spin [animation-iteration-count:1]" : ""}
            />
        ),
        [refreshing]
    );

    const setOffset = useCallback((offset: number) => setCurrentPage(~~(offset / MAIL_LIMIT_PER_PAGE + 1)), [])

    const preparedThreads = useMemo(

        () => inboxMailThreads.map(t => ({
            ...t,
            display: prepareThreadDisplayData(t, currentUser, isAdmin)
        })),
        [inboxMailThreads, currentUser, isAdmin]
    )

    if (!currentUser) return;

    return (
        <div className='flex flex-col h-full overflow-hidden'>
            <props.InboxMailHeader >
                <div className="flex items-center gap-x-2">
                    <KernButton
                        className="text-gray-700"
                        icon={refreshIconFn}
                        onClick={() => {
                            setRefreshing(true);
                            refetchInboxMailOverview();
                            setTimeout(() => setRefreshing(false), 1000);
                        }}
                        disabled={refreshing}
                    />
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
            </ props.InboxMailHeader >
            {inboxMailThreads?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="text-2xl font-semibold mb-4">No Inbox Mails</div>
                    <div className="text-gray-500 mb-6">You have no mails in your inbox</div>
                </div>
            ) : <div className="grid grid-cols-3 gap-x-4 p-3 overflow-hidden flex-1 ">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-lg mb-2">
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
                    <Pagination offset={(currentPage - 1) * MAIL_LIMIT_PER_PAGE} setOffset={setOffset} fullCount={fullCount} limit={MAIL_LIMIT_PER_PAGE} previousLabel={t("inboxMail.previous")} nextLabel={t("inboxMail.next")} />

                </div>
                <div className="col-span-2 overflow-y-auto pr-2 pb-12 h-0 min-h-full">
                    {selectedThread && threadMails && threadMails.length > 0 ? (
                        <>
                            <div className="flex items-center  gap-x-2">
                                {isAdmin && selectedThread.isAdminSupportThread && (
                                    <div className="flex items-center gap-x-1 mb-2 mt-1 overflow-y-visible z-10">
                                        <span className="text-sm font-medium mr-2">Progress:</span>
                                        <KernDropdown
                                            dropdownWidth="w-40"
                                            buttonName={progressStateOptions.find(option => option.value === (selectedThread.progressState))?.name || "Set progress"}
                                            options={progressStateOptions}
                                            selectedOption={(option: { label: string; value: InboxMailThreadSupportProgressState }) => handleInboxMailProgressChange(option.value)}
                                        />
                                    </div>
                                )}
                                {isAdmin && selectedThread.isAdminSupportThread && selectedThread.progressState !== InboxMailThreadSupportProgressState.PENDING && selectedThread.metaData?.supportOwnerName && (
                                    <div className="bg-orange-400 text-white rounded-full px-2 py-0.5 text-xs flex items-center gap-x-2 ml-2">
                                        <IconProgressCheck
                                            className="w-5 h-5" /> {selectedThread.metaData?.supportOwnerName?.first} {selectedThread.metaData?.supportOwnerName?.last}
                                    </div>
                                )}
                            </div>
                            {threadMails.map((mail: InboxMail) => (
                                <ThreadMailItem
                                    key={mail.id}
                                    mail={mail}
                                    currentUser={currentUser}
                                    onDelete={() => deleteInboxMailById(mail.id, () => {
                                        if (threadMails.length === 1) {
                                            setSelectedThread(null);
                                            refetchInboxMailOverview();
                                            return;
                                        }
                                        refetchSelectedThreadMails();
                                    })}
                                />
                            ))}
                            <div className="flex items-center">
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
            </div>
            }
            <CreateNewMailModal isAdmin={isAdmin} isAdminSupportThread={isAdminSupportThread} open={openCreateMail} setOpen={setOpenCreateMail} thread={selectedThread} isNewThread={isNewThread} handleInboxMailCreation={handleInboxMailCreation} users={users} currentUser={currentUser} translationScope={props.translatorScope} organizations={organizations} selectedOrganization={selectedOrganization} setSelectedOrganization={setSelectedOrganization} />
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
                                {displayName ?? "<Unknown User>"}
                            </div>
                            {unreadMailCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center bg-slate-400 text-white text-[0.625rem] font-semibold rounded-full h-4 min-w-4 px-1.5 whitespace-nowrap">
                                    {unreadMailCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex ml-auto items-center gap-x-2 flex-wrap gap-y-2 justify-end">
                            <div className={` ${(props.thread.isAdminSupportThread || props.thread.isImportant || props.thread.progressState === InboxMailThreadSupportProgressState.IN_PROGRESS) ? "flex" : "hidden"} items-center gap-x-2 bg-slate-100/70 py-1 px-2 rounded-full`}>
                                {props.thread.isAdminSupportThread && (
                                    <Tooltip
                                        content={"Support request"}
                                        placement="top"
                                        color="invert"
                                    >
                                        <IconHelpCircle className="h-[1.125rem] w-auto text-red-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.isImportant && (
                                    <Tooltip content="High priority" placement="top" color="invert">
                                        <IconAlertTriangle className="h-[1.125rem] w-auto text-orange-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.progressState === InboxMailThreadSupportProgressState.IN_PROGRESS && (
                                    <Tooltip content="In progress" placement="top" color="invert">
                                        <IconProgressCheck className="h-[1.125rem] w-auto text-orange-600 mb-0.5" />
                                    </Tooltip>
                                )}
                                {props.thread.progressState === InboxMailThreadSupportProgressState.RESOLVED && (
                                    <Tooltip content="Resolved" placement="top" color="invert">
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

interface ThreadMailItemProps {
    mail: InboxMail;
    currentUser: User;
    onDelete?: (id: string) => void;
}

function ThreadMailItem(props: ThreadMailItemProps) {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const handleConfirmDelete = useCallback(() => {
        if (props.onDelete) {
            props.onDelete(props.mail.id);
        }
    }, [props.mail.id, props.onDelete]);

    return (
        <>
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
                    {props.currentUser.id === props.mail.senderId && (
                        <KernButton
                            icon={IconTrash}
                            size="small"
                            className="text-gray-700 hover:text-red-700"
                            onClick={() => setOpenDeleteConfirm(true)}
                        />
                    )}
                </div>
            </div>

            <ConfirmDeleteModal
                open={openDeleteConfirm}
                setOpen={setOpenDeleteConfirm}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
interface ConfirmDeleteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
}


function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {

    const cancelRef = useRef(null);

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelRef} onClose={props.setOpen ? props.setOpen : () => null}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full justify-center p-4 items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className={`flex justify-center w-full`}>
                                <div className={`w-full max-w-md`}>
                                    <Dialog.Panel className="relative rounded-lg bg-white shadow-xl sm:my-8">
                                        <div className="p-6">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center 
                          rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <IconAlertTriangle className="h-6 w-6 text-red-600" />
                                                </div>

                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-lg font-medium leading-6 text-gray-900"
                                                    >
                                                        Delete Message
                                                    </Dialog.Title>

                                                    <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete this mail for all? This action cannot be undone.</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
                                                <button
                                                    onClick={() => {
                                                        props.onConfirm();
                                                        props.setOpen(false);
                                                    }}
                                                    className="inline-flex w-full justify-center rounded-md border border-transparent 
                       bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm 
                       hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    ref={cancelRef}
                                                    onClick={() => props.setOpen(false)}
                                                    className="inline-flex w-full justify-center rounded-md border border-gray-300 
                       bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm 
                       hover:bg-gray-50 sm:w-auto sm:text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}