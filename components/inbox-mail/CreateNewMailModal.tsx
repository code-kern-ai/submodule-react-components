import BaseModal from "@/src/components/Common/ModalComponents/Modal";
import ModalCreateFooter from "@/src/components/Common/ModalComponents/ModalCreateFooter";
import { Dialog } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { sendNewMail } from "./service-mail";
import useRefState from "../../hooks/useRefState";
import { InfoButton } from "../InfoButton";
import { MemoIconMail } from "../kern-icons/icons";
import { User } from "../inbox-mail/InboxMailView";


interface CreateNewMailModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    refetchInboxMailOverview: () => void;
    users: User[];
    threadId?: string;
    isNewThread?: boolean;
};

export default function CreateNewMailModal(props: CreateNewMailModalProps) {
    const router = useRouter();
    const { t } = useTranslation('projectOverview');
    const projectId = router.query.projectId as string;
    const chatId = router.query.chatId as string;
    const { state: subject, setState: setSubject, ref: subjectRef } = useRefState('');
    const { state: content, setState: setContent, ref: contentRef } = useRefState('');
    const { state: includeProject, setState: setIncludeProject, ref: includeProjectRef } = useRefState(false);
    const { state: includeChat, setState: setIncludeChat, ref: includeChatRef } = useRefState(false);
    const { state: markAsImportant, setState: setMarkAsImportant, ref: markAsImportantRef } = useRefState(false);
    const { state: selectedPeople, setState: setSelectedPeople, ref: selectedPeopleRef } = useRefState<User[]>([]);


    const cancelButtonRef = useRef(null);

    const initModal = useCallback(() => {
        setSelectedPeople([]);
        setSubject('');
        setContent('');
        setIncludeProject(false);
        setIncludeChat(false);
        setMarkAsImportant(false);
    }, []);

    const onTransitionComplete = useCallback(initModal, []);

    const disabledSend = useMemo(() => {
        return selectedPeople.length === 0 || subject.trim() === '' || content.trim() === '';
    }, [selectedPeople, subject, content]);

    const handleCreateMail = useCallback(() => {
        const metaData = {
            includeProject: includeProjectRef.current,
            includeChat: includeChatRef.current
        };

        sendNewMail(selectedPeopleRef.current.map((user) => user.id), subjectRef.current, contentRef.current, markAsImportantRef.current, metaData, (result) => {
            props.setOpen(false);
            initModal();
            props.refetchInboxMailOverview();
        }, props.isNewThread ? undefined : props.threadId);
    }, [props.threadId, props.isNewThread]);

    return (
        <BaseModal
            open={props.open}
            setOpen={props.setOpen}
            onTransitionComplete={onTransitionComplete}
            maxWidth="2xl"
            initialFocus={cancelButtonRef}
        >
            <div className="p-6">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <MemoIconMail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            {t("inboxMail.modalTitle")}
                        </Dialog.Title>
                        <div className='mt-2 flex flex-col gap-y-2'>

                            <UserSelector
                                label={t("inboxMail.sendTo")}
                                users={props.users}
                                selectedUsers={selectedPeople}
                                onChange={setSelectedPeople}
                            />
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                    {t("inboxMail.subject")}:
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
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
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <input
                                    type="checkbox"
                                    name="markAsImportant"
                                    id="markAsImportant"
                                    checked={markAsImportant}
                                    onChange={(e) => setMarkAsImportant(e.target.checked)}
                                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                                <label htmlFor="markAsImportant" className="block text-sm font-medium text-gray-700 cursor-pointer">
                                    {t("inboxMail.markAsImportant")}
                                </label>
                                <InfoButton content={t("inboxMail.markAsImportantInfo")} infoButtonSize="sm" />
                            </div>
                            {projectId && <div className="flex items-center gap-x-2">
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
                            {chatId && <div className="flex items-center gap-x-2">
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
                <ModalCreateFooter
                    handleCreate={handleCreateMail}
                    closeDialog={() => props.setOpen(false)}
                    cancelButtonRef={cancelButtonRef}
                    createButtonName={t("inboxMail.sendButton")}
                    disabledButton={disabledSend}
                />
            </div>
        </BaseModal>
    )
}



interface UserSelectorProps {
    users: User[];
    selectedUsers: User[];
    onChange: (selected: User[]) => void;
    showAll?: boolean;
    label?: string;
}

function UserSelector(props: UserSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editableRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if (inputValue.trim() === "") {
            if (props.showAll)
                setFilteredUsers(props.users);
            else
                setFilteredUsers([]);
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
    }, [inputValue, props.users]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserSelect = (user: any) => {
        if (!props.selectedUsers.some((u) => u.id === user.id)) {
            props.onChange([...props.selectedUsers, user]);
        }
        setInputValue("");
        if (editableRef.current) editableRef.current.textContent = "";
        setIsOpen(false);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const value = e.currentTarget.textContent || "";
        setInputValue(value);
    };

    const handleRemove = (mail: string) => {
        props.onChange(props.selectedUsers.filter((p) => p.mail !== mail));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && filteredUsers.length > 0) {
            e.preventDefault();
            handleUserSelect(filteredUsers[0]);
        } else if (e.key === "Backspace" && !inputValue && props.selectedUsers.length) {
            handleRemove(props.selectedUsers[props.selectedUsers.length - 1].mail);
        }
    };
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
                className="w-full flex flex-wrap items-center gap-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500"
                onClick={() => {
                    setIsOpen(true);
                    editableRef.current?.focus();
                }}
            >
                {props.selectedUsers.map((user) => (
                    <span
                        key={user.mail}
                        className="flex items-center bg-purple-100 text-purple-800 text-sm px-2 py-0.5 rounded-lg leading-none"
                    >
                        {`${user.firstName} ${user.lastName}`}
                        <button
                            type="button"
                            onClick={() => handleRemove(user.mail)}
                            className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                        >
                            ✕
                        </button>
                    </span>
                ))}

                <div
                    ref={editableRef}
                    id="people"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow border-none sm:text-sm outline-none focus:ring-0 focus:border-transparent min-w-[100px]"
                    data-placeholder={
                        props.selectedUsers.length ? "" : "Type a name or email..."
                    }
                    style={{ minHeight: "1.5rem" }}
                />
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