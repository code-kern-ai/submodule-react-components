
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail, InboxMailThread, User, InboxMailThreadSupportProgressState } from "./types-mail";
import { getInboxMailOverviewByThreadsPaginated, getInboxMailsByThread, createInboxMailByThread, updateInboxMailThreadProgress, deleteInboxMailById } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus, MemoIconRefresh, MemoIconHelpCircle } from "../kern-icons/icons";
import useRefState from "../../hooks/useRefState";
import { MAIL_LIMIT_PER_PAGE, prepareThreadDisplayData } from "./helper";
import useEnumOptionsTranslated, { getEnumOptionsForLanguage } from "../../hooks/enums/useEnumOptionsTranslated";
import { getUsers, getUserInfoExtended, getIsAdmin, getAllOrganizations } from "./service-mail";
import Pagination from "../pagination/Pagination";
import InboxMailAdminPanel from "./InboxMailAdminPanel";
import { UserRole } from "@/submodules/javascript-functions/enums/enums";
import InboxMailThreadOverview from "./InboxMailThreadOverview";
import ThreadMailItem from "./InboxMailItem";


interface InboxMailViewProps {
    InboxMailHeader: (props: { children: React.ReactNode }) => JSX.Element;
    translatorScope: { type: "i18n" | "local"; translator: (key: string) => string };
    handleInboxMailRefreshToken?: (token: any) => void;
}
export default function InboxMailView(props: InboxMailViewProps) {

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
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState<User[]>([]);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

    const progressStateOptions = props.translatorScope?.type === "local"
        ? getEnumOptionsForLanguage(InboxMailThreadSupportProgressState, "InboxMailThreadSupportProgressState", t, "en")
        : props.translatorScope?.type === "i18n" ? useEnumOptionsTranslated(InboxMailThreadSupportProgressState, "InboxMailThreadSupportProgressState", "enums") : [];

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
        if (isAdmin === undefined || !currentUser) return;
        const limitedTeams = (currentUser?.role == UserRole.ENGINEER || isAdmin) ? false : true;
        getUsers((res) => setUsers(res.filter(u => u.id !== currentUser.id)), true, limitedTeams, limitedTeams, selectedOrganization?.id);
    }, [isAdmin, selectedOrganization, currentUser]);

    useEffect(() => {
        refetchInboxMailOverview();
    }, [currentPage]);

    useEffect(() => {
        if (!selectedThread?.id) return
        refetchSelectedThreadMails();

    }, [selectedThread?.id, props.handleInboxMailRefreshToken, isAdmin]);

    const refetchInboxMailOverview = useCallback(() => {
        getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) => {
            setInboxMailThreads(res.threads);
            setFullCount(res?.totalThreads);
            props.handleInboxMailRefreshToken?.(Date.now());
        });
    }, [currentPage, props.handleInboxMailRefreshToken]);

    const refetchSelectedThreadMails = useCallback((resetRefreshToken: boolean = true) => {
        if (!selectedThread) return;
        getInboxMailsByThread(selectedThread.id, (res) => {
            setThreadMails(res);
            if (selectedThread.unreadMailCount > 0) {
                setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? { ...t, unreadMailCount: 0 } : t));
                if (resetRefreshToken) props.handleInboxMailRefreshToken?.(Date.now());
            }
            if (selectedThread.isAdminSupportThread && isAdmin && selectedThread.metaData?.unreadMailCountAdmin > 0) {
                setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? {
                    ...t,
                    metaData: {
                        ...t.metaData,
                        unreadMailCountAdmin: 0
                    },
                } : t));
                if (resetRefreshToken) props.handleInboxMailRefreshToken?.(Date.now());
            }
        });
    }, [selectedThread, isAdmin, props.handleInboxMailRefreshToken]);

    const handleInboxMailCreation = useCallback((content: string, recipientIds?: string[], subject?: string, isImportant?: boolean, metaData?: any) => {
        createInboxMailByThread(content, (result) => {
            setOpenCreateMail(false);
            getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) => {
                if (isNewThread && res.threads.length > 0) {
                    setSelectedThread(res.threads.find((thread) => thread.id === result.threadId));
                }
                setInboxMailThreads(res.threads);
                setFullCount(res?.totalThreads);
                if (selectedThread && !isNewThread) {
                    refetchSelectedThreadMails();
                }
            });
        }, recipientIds, subject, isImportant, metaData, isNewThread ? undefined : selectedThread?.id, isAdminSupportThreadRef.current);
    }, [isNewThread, refetchSelectedThreadMails, selectedThread, currentPage]);

    const handleInboxMailProgressChange = useCallback((progressState: InboxMailThreadSupportProgressState) => {
        if (!selectedThread) return;
        updateInboxMailThreadProgress(selectedThread.id, progressState, () => {
            let supportOwnerName = selectedThread.metaData?.supportOwnerName || "";
            if (progressState === InboxMailThreadSupportProgressState.IN_PROGRESS) {
                supportOwnerName = currentUser ? { "first": currentUser.firstName, "last": currentUser.lastName } : null;
            } else if (progressState === InboxMailThreadSupportProgressState.PENDING) {
                supportOwnerName = null;
            }
            setSelectedThread({
                ...selectedThread,
                progressState: progressState,
                metaData: { ...selectedThread.metaData, supportOwnerName }
            });
            setInboxMailThreads(prevThreads =>
                prevThreads.map(t =>
                    t.id === selectedThread.id
                        ? { ...t, progressState: progressState, metaData: { ...t.metaData, supportOwnerName } }
                        : t
                )
            );
        });
    }, [selectedThread, currentUser]);

    const refreshIconFn = useCallback(
        () => (
            <MemoIconRefresh
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

    const refretchAll = useCallback(() => {
        setRefreshing(true);
        refetchInboxMailOverview();
        refetchSelectedThreadMails(false);
        setTimeout(() => setRefreshing(false), 1000);
    }, [refetchInboxMailOverview, refetchSelectedThreadMails]);

    if (!currentUser) return;

    return (
        <div className='flex flex-col h-full overflow-hidden'>
            <props.InboxMailHeader >
                <div className="flex items-center gap-x-2">
                    <KernButton
                        className="text-gray-700"
                        icon={refreshIconFn}
                        onClick={refretchAll}
                        disabled={refreshing}
                    />
                    <KernButton
                        text={t("inboxMail.getSupport")}
                        icon={MemoIconHelpCircle}
                        iconColor="red"
                        onClick={() => {
                            setIsNewThread(true);
                            setOpenCreateMail(true);
                            setIsAdminSupportThread(true);
                        }} />
                    <KernButton
                        text={t("inboxMail.newMail")}
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
                    <div className="text-2xl font-semibold mb-4">{t("inboxMail.noMails")}</div>
                    <div className="text-gray-500 mb-6">{t("inboxMail.noMailsInfo")}</div>
                </div>
            ) : <div className="grid grid-cols-3 gap-x-4 p-3 overflow-hidden flex-1 ">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-lg mb-2">
                        {preparedThreads.map((threadOverview: InboxMailThread) => (
                            <InboxMailThreadOverview
                                key={threadOverview.id}
                                thread={threadOverview}
                                isAdmin={isAdmin}
                                selectedThread={selectedThread}
                                setSelectedThread={setSelectedThread}
                                translator={t}
                            />
                        ))}
                    </div>
                    <Pagination offset={(currentPage - 1) * MAIL_LIMIT_PER_PAGE} setOffset={setOffset} fullCount={fullCount} limit={MAIL_LIMIT_PER_PAGE} previousLabel={t("inboxMail.previous")} nextLabel={t("inboxMail.next")} reducePageNumbers />
                </div>
                <div className="col-span-2 overflow-y-auto pr-2 pb-12 h-0 min-h-full">
                    {selectedThread && threadMails && threadMails.length > 0 ? (
                        <>
                            {isAdmin &&
                                <InboxMailAdminPanel
                                    selectedThread={selectedThread}
                                    progressStateOptions={progressStateOptions}
                                    handleInboxMailProgressChange={handleInboxMailProgressChange}
                                    currentUser={currentUser}
                                    refetchInboxMailOverview={refetchInboxMailOverview}
                                />
                            }
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
                                        refetchSelectedThreadMails(false);
                                    })}
                                    translator={t}
                                />
                            ))}
                            <div className="flex items-center">
                                <KernButton
                                    className="ml-auto"
                                    text={t("inboxMail.reply")}
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
                            <div className="text-gray-500 mb-6">{t("inboxMail.mailSelectionPlaceholder")}</div>
                        </div>}
                </div>
            </div>
            }
            <CreateNewMailModal isAdmin={isAdmin} isAdminSupportThread={isAdminSupportThread} open={openCreateMail} setOpen={setOpenCreateMail} thread={selectedThread} isNewThread={isNewThread} handleInboxMailCreation={handleInboxMailCreation} users={users} currentUser={currentUser} translator={t} organizations={organizations} selectedOrganization={selectedOrganization} setSelectedOrganization={setSelectedOrganization} />
        </div >

    )
}