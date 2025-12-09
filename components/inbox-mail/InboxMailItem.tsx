import { IconTrash } from "@tabler/icons-react";
import KernButton from "../kern-button/KernButton";
import DeleteInboxMailModal from "./DeleteInboxMailModal";
import { InboxMail, User } from "./types-mail";
import { useCallback, useMemo, useState } from "react";
import { formatDisplayTimestampFull } from "@/submodules/javascript-functions/date-parser";

interface ThreadMailItemProps {
    mail: InboxMail;
    currentUser: User;
    translator: (key: string) => string;
    onDelete?: (id: string) => void;
}

export default function ThreadMailItem(props: ThreadMailItemProps) {

    const t = useMemo(() => props.translator, [props.translator]);
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
                            {t("inboxMail.to")}: {props.mail.recipientNames.map((name) => `${name?.first} ${name?.last}`).join(", ")}
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
            <DeleteInboxMailModal
                open={openDeleteConfirm}
                setOpen={setOpenDeleteConfirm}
                onConfirm={handleConfirmDelete}
                translator={props.translator}
            />
        </>
    );
}