
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail, InboxMailThread, User, InboxMailThreadSupportProgressState, InboxMailFilter, SUPPORT_FILTERS, THREAD_TYPE_FILTERS } from "./types-mail";
import { getInboxMailOverviewByThreadsPaginated, getInboxMailsByThread, createInboxMailByThread, updateInboxMailThreadProgress, deleteInboxMailById } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus, MemoIconRefresh, MemoIconHelpCircle, MemoIconX } from "../kern-icons/icons";
import useRefState from "../../hooks/useRefState";
import { MAIL_LIMIT_PER_PAGE, prepareThreadDisplayData } from "./helper";
import useEnumOptionsTranslated, { getEnumOptionsForLanguage } from "../../hooks/enums/useEnumOptionsTranslated";
import { getUsers, getUserInfoExtended, getIsAdmin, getAllOrganizations } from "./service-mail";
import Pagination from "../pagination/Pagination";
import InboxMailAdminPanel from "./InboxMailAdminPanel";
import { UserRole } from "@/submodules/javascript-functions/enums/enums";
import InboxMailThreadOverview from "./InboxMailThreadOverview";
import ThreadMailItem from "./InboxMailItem";
import KernDropdown from "../KernDropdown";
import { enumToArray } from "@/submodules/javascript-functions/general";
import { caseType } from "@/submodules/javascript-functions/case-types-parser";


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
    const { state: currentFilter, setState: setCurrentFilter, ref: currentFilterRef } = useRefState<InboxMailFilter[]>([]);
    const { state: filterOrgId, setState: setFilterOrgId, ref: filterOrgIdRef } = useRefState<string | null>(null);

    const progressStateOptions = props.translatorScope?.type === "local"
        ? getEnumOptionsForLanguage(InboxMailThreadSupportProgressState, "InboxMailThreadSupportProgressState", t, "en")
        : props.translatorScope?.type === "i18n" ? useEnumOptionsTranslated(InboxMailThreadSupportProgressState, "InboxMailThreadSupportProgressState", "enums") : [];

    const allFilterOptions = useMemo(() => enumToArray(InboxMailFilter, { caseType: caseType.CAPITALIZE_FIRST_PER_WORD }), []);

    const availableFilterOptions = useMemo(() =>
        allFilterOptions.filter(option => !currentFilter.includes(option.value)),
        [allFilterOptions, currentFilter]
    );

    const filterTooltips = useMemo(() =>
        availableFilterOptions.map(option =>
            option.value === InboxMailFilter.ALL
                ? t("inboxMail.filterAllTooltip")
                : null
        ),
        [availableFilterOptions, t]
    );

    const addFilter = useCallback((option: { name: string, value: InboxMailFilter }) => {
        const newValue = option.value;
        let newFilters: InboxMailFilter[];

        // ALL clears everything else
        if (newValue === InboxMailFilter.ALL) {
            newFilters = [InboxMailFilter.ALL];
        } else {
            let filtered = currentFilterRef.current.filter(f => f !== InboxMailFilter.ALL);
            // Support filters are mutually exclusive
            if (SUPPORT_FILTERS.includes(newValue)) filtered = filtered.filter(f => !SUPPORT_FILTERS.includes(f));

            // Thread type filters are mutually exclusive
            if (THREAD_TYPE_FILTERS.includes(newValue)) filtered = filtered.filter(f => !THREAD_TYPE_FILTERS.includes(f));

            newFilters = [...filtered, newValue];
        }
        setCurrentFilter(newFilters);
    }, []);

    const removeFilter = useCallback((filter: InboxMailFilter) => {
        const newFilters = currentFilterRef.current.filter(f => f !== filter);
        if (newFilters.length === 0) newFilters.push(InboxMailFilter.ALL);
        setCurrentFilter(newFilters);
    }, []);

    const getFilterDisplayName = useCallback((filter: InboxMailFilter) => {
        return allFilterOptions.find(o => o.value === filter)?.name || filter;
    }, [allFilterOptions]);

    const orgFilterOptions = useMemo(() =>
        organizations.map((org: any) => ({ name: org.name, value: org.id })),
        [organizations]
    );

    const selectedOrgName = useMemo(() =>
        organizations.find((org: any) => org.id === filterOrgId)?.name || null,
        [organizations, filterOrgId]
    );


    const selectOrgFilter = useCallback((option: { name: string, value: string }) => {
        if (option.value) setFilterOrgId(option.value);
    }, []);

    const clearOrgFilter = useCallback(() => setFilterOrgId(null), []);

    useEffect(() => {
        getUserInfoExtended(res => {
            setCurrentUser(res);
        });
        getIsAdmin((isAdmin) => setIsAdmin(isAdmin));
    }, []);

    useEffect(() => {
        if (isAdmin === undefined) return;
        setCurrentFilter(isAdmin ? [InboxMailFilter.SUPPORT_PENDING] : [InboxMailFilter.ALL]);
    }, [isAdmin]);

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
        if (isAdmin === undefined || currentFilter.length === 0) return;
        refetchInboxMailOverview();
    }, [currentPage, isAdmin]);

    useEffect(() => {
        if (currentFilter.length === 0) return;
        setCurrentPage(1);
        refetchInboxMailOverview();
    }, [currentFilter]);

    useEffect(() => {
        if (isAdmin === undefined || currentFilter.length === 0) return;
        setCurrentPage(1);
        refetchInboxMailOverview();
    }, [filterOrgId]);

    useEffect(() => {
        if (!selectedThread?.id) return
        refetchSelectedThreadMails();

    }, [selectedThread?.id, props.handleInboxMailRefreshToken, isAdmin]);

    const refetchInboxMailOverview = useCallback(() => {
        const filters: string[] = [...currentFilterRef.current];
        if (filterOrgIdRef.current) filters.push(filterOrgIdRef.current);
        getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, filters, (res) => {
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
                setSelectedThread(prev => prev ? { ...prev, unreadMailCount: 0 } : prev);
                if (resetRefreshToken) props.handleInboxMailRefreshToken?.(Date.now());
            }
            if (selectedThread.isAdminSupportThread && isAdmin && selectedThread.metaData?.unreadMailCountAdmin > 0) {
                const updatedMetaData = { ...selectedThread.metaData, unreadMailCountAdmin: 0 };
                setInboxMailThreads(prevThreads => prevThreads.map(t => t.id === selectedThread.id ? {
                    ...t,
                    metaData: updatedMetaData,
                } : t));
                setSelectedThread(prev => prev ? { ...prev, metaData: updatedMetaData } : prev);
                if (resetRefreshToken) props.handleInboxMailRefreshToken?.(Date.now());
            }
        });
    }, [selectedThread, isAdmin, props.handleInboxMailRefreshToken]);

    const handleInboxMailCreation = useCallback((content: string, recipientIds?: string[], subject?: string, isImportant?: boolean, metaData?: any) => {
        createInboxMailByThread(content, (result) => {
            setOpenCreateMail(false);
            const filters: string[] = [...currentFilterRef.current];
            if (filterOrgIdRef.current) filters.push(filterOrgIdRef.current);
            getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, filters, (res) => {
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
                <div className="flex items-center justify-end gap-2 w-full">
                    {isAdmin && (
                        <>
                            <div className="flex flex-wrap items-center gap-2">
                                {currentFilter.map(filter => (
                                    <div key={filter} className="flex items-center gap-x-1.5 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap max-w-48">
                                        <span className="truncate">{getFilterDisplayName(filter)}</span>
                                        {filter != InboxMailFilter.ALL && (
                                            <button onClick={() => removeFilter(filter)} className="hover:bg-gray-300 rounded-full p-0.5 flex-shrink-0">
                                                <MemoIconX className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {selectedOrgName && (
                                    <div className="flex items-center gap-x-1.5 bg-indigo-200 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap max-w-48">
                                        <span className="truncate">{selectedOrgName}</span>
                                        <button onClick={clearOrgFilter} className="hover:bg-indigo-300 rounded-full p-0.5 flex-shrink-0">
                                            <MemoIconX className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-x-2 flex-shrink-0 whitespace-nowrap">
                                {availableFilterOptions.length > 0 && (
                                    <KernDropdown
                                        buttonName={t("inboxMail.addFilter")}
                                        options={availableFilterOptions}
                                        selectedOption={addFilter}
                                        dropdownWidth="w-32"
                                        dropdownItemsWidth="w-40"
                                        buttonClasses="py-1 px-2 text-xs whitespace-nowrap"
                                        tooltipsArray={filterTooltips}
                                    />
                                )}
                                {orgFilterOptions.length > 0 && (
                                    <KernDropdown
                                        buttonName={t("inboxMail.filterByOrg")}
                                        options={orgFilterOptions}
                                        selectedOption={selectOrgFilter}
                                        buttonClasses="py-1 px-2 text-xs whitespace-nowrap"
                                    />
                                )}
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-x-2 flex-shrink-0">
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
                                    translator={t}
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