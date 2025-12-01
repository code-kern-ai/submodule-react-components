import { Dialog, Transition } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import useRefState from "../../hooks/useRefState";
import { InfoButton } from "../InfoButton";
import { MemoIconMail } from "../kern-icons/icons";
import { User, InboxMailThread } from "./types-mail";
import { Fragment } from 'react'
import KernButton from "../kern-button/KernButton";
import KernDropdown from "../KernDropdown";
interface CreateNewMailModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleInboxMailCreation: (content: string, recipientIds?: string[], subject?: string, isImportant?: boolean, metaData?: any, threadId?: string) => void;
    users: User[];
    currentUser: User;
    isAdmin: boolean;
    translator: (key: string) => string;
    selectedOrganization?: any;
    setSelectedOrganization?: (org: any) => void;
    organizations?: any[];
    thread?: InboxMailThread;
    isNewThread?: boolean;
    isAdminSupportThread?: boolean;
};

export default function CreateNewMailModal(props: CreateNewMailModalProps) {
    const router = useRouter();
    const t = useMemo(() => props.translator, [props.translator]);

    const projectId = router.query.projectId as string;
    const chatId = router.query.chatId as string;
    const { state: subject, setState: setSubject, ref: subjectRef } = useRefState('');
    const { state: content, setState: setContent, ref: contentRef } = useRefState('');
    const { state: includeProject, setState: setIncludeProject, ref: includeProjectRef } = useRefState(false);
    const { state: includeChat, setState: setIncludeChat, ref: includeChatRef } = useRefState(false);
    const { state: isImportant, setState: setIsImportant, ref: isImportantRef } = useRefState(false);
    const { state: selectedPeople, setState: setSelectedPeople, ref: selectedPeopleRef } = useRefState<User[]>([]);


    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if (!(props.open && props.thread && !props.isNewThread && props.thread.latestMail && props.users)) return;

        const currentThreadPeople = props.thread.participantIds;
        setSelectedPeople(props.users.filter((user) => currentThreadPeople.includes(user.id) && user.id !== props.currentUser.id));
        setSubject(props.thread.subject);
    }, [props.open, props.thread, props.isNewThread, props.users]);

    useEffect(() => {
        if (projectId) {
            setIncludeProject(true);
        }
        if (chatId) {
            setIncludeChat(true);
        }
    }, [projectId, chatId]);

    const initModal = useCallback(() => {
        setSelectedPeople([]);
        setSubject('');
        setContent('');
        props.setSelectedOrganization?.(null);
        setIsImportant(false);
    }, [props.setSelectedOrganization]);

    const clearRouterParams = useCallback(() => {
        if (!(projectId || chatId)) return;
        router.replace('/inbox-mail');
    }, [projectId, chatId]);

    const disabledSend = useMemo(() => {
        return (props.isAdminSupportThread ? false : selectedPeople.length === 0) || subject.trim() === '' || content.trim() === '';
    }, [selectedPeople, subject, content, props.isAdminSupportThread]);

    const handleCreateMail = useCallback(() => {
        const metaData = {
            ...(projectId && includeProjectRef.current && { projectId }),
            ...(chatId && includeChatRef.current && { conversationId: chatId })
        };
        props.handleInboxMailCreation(contentRef.current, selectedPeopleRef.current.map((user) => user.id), subjectRef.current, isImportantRef.current, metaData, props.isNewThread ? undefined : props.thread?.id);
        initModal();
        clearRouterParams();
    }, [props.thread?.id, props.isNewThread, projectId, chatId]);

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={props.setOpen ? props.setOpen : () => null}>
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
                            <div className="flex justify-center w-full">
                                <div className="w-full max-w-2xl">
                                    <Dialog.Panel className="relative rounded-lg bg-white shadow-xl sm:my-8">

                                        <div className="p-6">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <MemoIconMail className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                        {props.isNewThread ? t("inboxMail.modalTitle") : t("inboxMail.replyModalTitle")}
                                                    </Dialog.Title>
                                                    <div className='mt-3 flex flex-col gap-y-2'>
                                                        {props.isAdmin && props.isNewThread && !props.isAdminSupportThread &&
                                                            <div className="text-sm text-gray-500 text-left">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("inboxMail.organization")}</label>
                                                                <KernDropdown options={props.organizations} buttonName={props.selectedOrganization?.name || t("inboxMail.orgSelectionPlaceholder")} selectedOption={props.setSelectedOrganization} scrollAfterNOptions={5} />
                                                            </div>
                                                        }
                                                        {props.isAdminSupportThread ?
                                                            <KernAIReport translator={t} />
                                                            :
                                                            <UserSelector
                                                                label={t("inboxMail.sendTo")}
                                                                users={props.users}
                                                                selectedUsers={selectedPeople}
                                                                onChange={setSelectedPeople}
                                                                disabled={!props.isNewThread}
                                                                translator={t}
                                                            />
                                                        }
                                                        <div>
                                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                                                {t("inboxMail.subject")}:
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    type="text"
                                                                    name="subject"
                                                                    id="subject"
                                                                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:cursor-not-allowed disabled:bg-slate-50"
                                                                    value={subject}
                                                                    onChange={(e) => setSubject(e.target.value)}
                                                                    disabled={!props.isNewThread}
                                                                    placeholder={t("inboxMail.subjectPlaceholder")}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                                                {t("inboxMail.content")}:
                                                            </label>
                                                            <div className="mt-1">
                                                                <textarea
                                                                    name="content"
                                                                    id="content"
                                                                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                    value={content}
                                                                    onChange={(e) => setContent(e.target.value)}
                                                                    rows={8}
                                                                    placeholder={t("inboxMail.contentPlaceholder")}
                                                                />
                                                            </div>
                                                        </div>
                                                        {props.isNewThread &&
                                                            <div className="flex items-center gap-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    name="isImportant"
                                                                    id="isImportant"
                                                                    checked={isImportant}
                                                                    onChange={(e) => setIsImportant(e.target.checked)}
                                                                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                />
                                                                <label htmlFor="isImportant" className="block text-sm font-medium text-gray-700 cursor-pointer">
                                                                    {t("inboxMail.isImportant")}
                                                                </label>
                                                                <InfoButton content={t("inboxMail.isImportantInfo")} infoButtonSize="sm" />
                                                            </div>
                                                        }
                                                        {props.isAdminSupportThread && projectId && <div className="flex items-center gap-x-2">
                                                            <input
                                                                type="checkbox"
                                                                name="includeProject"
                                                                id="includeProject"
                                                                checked={includeProject}
                                                                onChange={(e) => setIncludeProject(e.target.checked)}
                                                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                            <label htmlFor="includeProject" className="block text-sm font-medium text-gray-700 cursor-pointer">
                                                                {t("inboxMail.includeProjectInfo")}
                                                            </label>
                                                        </div>}
                                                        {props.isAdminSupportThread && projectId && chatId && <div className="flex items-center gap-x-2">
                                                            <input
                                                                type="checkbox"
                                                                name="includeChat"
                                                                id="includeChat"
                                                                checked={includeChat}
                                                                onChange={(e) => setIncludeChat(e.target.checked)}
                                                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            />
                                                            <label htmlFor="includeChat" className="block text-sm font-medium text-gray-700 cursor-pointer">
                                                                {t("inboxMail.includeChatInfo")}
                                                            </label>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5 flex gap-x-2 flex-row-reverse">
                                                <KernButton
                                                    text={t("inboxMail.sendButton")}
                                                    disabled={disabledSend}
                                                    buttonColor="green"
                                                    solidTheme={true}
                                                    textColor="white"
                                                    size="solid-large"
                                                    onClick={handleCreateMail}
                                                />
                                                <KernButton
                                                    text={t("inboxMail.cancelButton")}
                                                    innerRef={cancelButtonRef}
                                                    onClick={() => props.setOpen(false)}
                                                />
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog >
        </Transition.Root >
    )
}



interface UserSelectorProps {
    users: User[];
    selectedUsers: User[];
    onChange: (selected: User[]) => void;
    translator: (key: string) => string;
    disabled?: boolean;
    showAll?: boolean;
    label?: string;
}

function UserSelector(props: UserSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editableRef = useRef<HTMLDivElement | null>(null);
    const t = useMemo(() => props.translator, [props.translator]);

    useEffect(() => {
        if (inputValue.trim() === "") {
            setFilteredUsers(props.showAll ? props.users : []);
        } else {
            const lower = inputValue.toLowerCase();
            setFilteredUsers(
                props.users.filter(
                    (u) =>
                        u.firstName.toLowerCase().includes(lower) ||
                        u.lastName.toLowerCase().includes(lower) ||
                        u.mail.toLowerCase().includes(lower)
                ).filter((u) => !props.selectedUsers.some((selected) => selected.id === u.id))
            );
        }
    }, [inputValue, props.users, props.selectedUsers, props.showAll]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserSelect = useCallback((user: User) => {
        if (!props.selectedUsers.some((u) => u.id === user.id)) {
            props.onChange([...props.selectedUsers, user]);
        }
        setInputValue("");
        if (editableRef.current) editableRef.current.textContent = "";
        setIsOpen(false);
    }, [props.selectedUsers, props.onChange]);

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        const value = e.currentTarget.textContent || "";
        setInputValue(value);
    }, []);

    const handleRemove = useCallback((mail: string) => {
        props.onChange(props.selectedUsers.filter((p) => p.mail !== mail));
    }, [props.selectedUsers, props.onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && filteredUsers.length > 0) {
            e.preventDefault();
            handleUserSelect(filteredUsers[0]);
        } else if (e.key === "Backspace" && !inputValue && props.selectedUsers.length) {
            handleRemove(props.selectedUsers[props.selectedUsers.length - 1].mail);
        }
    }, [filteredUsers, inputValue, props.selectedUsers, handleRemove, handleUserSelect]);

    return (
        <div className="relative" ref={containerRef}>
            {props.label && (
                <label
                    htmlFor="people"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {props.label}
                </label>
            )}

            <div
                className={`w-full flex flex-wrap items-center gap-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 ${props.disabled ? 'bg-slate-50 cursor-not-allowed' : 'bg-white cursor-text'} min-h-[40px] relative`}
                onClick={() => {
                    setIsOpen(true);
                    editableRef.current?.focus();
                }}
            >
                {props.selectedUsers.map((user) => (
                    <span
                        key={user.mail}
                        className="flex items-center bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-lg leading-none min-h-[1.5rem]"
                    >
                        {`${user.firstName} ${user.lastName}`}
                        {props.disabled ? null : (
                            <button
                                type="button"
                                onClick={() => handleRemove(user.mail)}
                                className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                            >
                                ✕
                            </button>
                        )}
                    </span>
                ))}

                <div
                    ref={editableRef}
                    id="people"
                    contentEditable={!props.disabled}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow border-none text-sm outline-none focus:ring-0 focus:border-transparent min-w-[100px] min-h-[1.5rem] relative"
                />
                {props.selectedUsers.length === 0 && !inputValue && (
                    <span
                        className="absolute left-4 bottom-2 text-gray-400 pointer-events-none select-none text-sm italic min-h-[1.5rem] "
                    >
                        {t("inboxMail.searchPlaceholder")}
                    </span>
                )}
            </div>

            {isOpen && filteredUsers.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-auto">
                    {filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex flex-col"
                        >
                            <span className="font-medium text-gray-800">{`${user.firstName} ${user.lastName}`}</span>
                            <span className="text-xs text-gray-500">{user.mail}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

interface KernAIReportProps {
    translator: (key: string) => string;
}

function KernAIReport(props: KernAIReportProps) {
    const t = useMemo(() => props.translator, [props.translator]);
    return (
        <div className="relative">
            <label
                htmlFor="kernai-team"
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {t("inboxMail.sendTo")}:
            </label>

            <div
                id="kernai-team"
                className="w-full flex flex-wrap items-center gap-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-slate-50"
            >
                <span className="flex items-center bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-lg leading-none min-h-[1.5rem] cursor-not-allowed">
                    {t("inboxMail.kernAITeam")}
                </span>
            </div>
        </div>
    );
}