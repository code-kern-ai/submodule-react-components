import BaseModal from "@/src/components/Common/ModalComponents/Modal";
import ModalCreateFooter from "@/src/components/Common/ModalComponents/ModalCreateFooter";
import { Dialog } from "@headlessui/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { sendNewMail } from "./service-mail";
import useRefState from "../../hooks/useRefState";
import { InfoButton } from "../InfoButton";
import { MemoIconMail } from "../kern-icons/icons";

type CreateNewMailModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function CreateNewMailModal(props: CreateNewMailModalProps) {
    const router = useRouter();
    const { t } = useTranslation('projectOverview');
    const projectId = router.query.projectId as string;
    const chatId = router.query.chatId as string;
    const { state: sendTo, setState: setSendTo, ref: sendToRef } = useRefState([]);
    const { state: subject, setState: setSubject, ref: subjectRef } = useRefState('');
    const { state: content, setState: setContent, ref: contentRef } = useRefState('');
    const { state: includeProject, setState: setIncludeProject, ref: includeProjectRef } = useRefState(false);
    const { state: includeChat, setState: setIncludeChat, ref: includeChatRef } = useRefState(false);
    const { state: markAsImportant, setState: setMarkAsImportant, ref: markAsImportantRef } = useRefState(false);
    const [availableEmails, setAvailableEmails] = useState<string[]>(['test@gmail.com', 'test1@gmail.com']);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    const cancelButtonRef = useRef(null);

    const initModal = useCallback(() => {
        setSendTo([]);
        setSubject('');
        setContent('');
        setIncludeProject(false);
        setIncludeChat(false);
        setMarkAsImportant(false);
    }, []);

    const onTransitionComplete = useCallback(initModal, []);

    const disabledSend = useMemo(() => {
        return sendTo.length === 0 || subject.trim() === '' || content.trim() === '';
    }, [sendTo, subject, content]);

    const handleCreateMail = useCallback(() => {
        const metaData = {
            includeProject: includeProjectRef.current,
            includeChat: includeChatRef.current
        };
        sendNewMail(sendToRef.current, subjectRef.current, contentRef.current, markAsImportantRef.current, metaData, (result) => {
            props.setOpen(false);
            initModal();
        });
    }, []);

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
                            <div>
                                <label htmlFor="sendTo" className="block text-sm font-medium text-gray-700">
                                    {t("inboxMail.sendTo")}:
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="sendTo"
                                        id="sendTo"
                                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        value={sendTo}
                                        onChange={(e) => setSendTo([e.target.value])}
                                    />
                                </div>
                            </div>
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