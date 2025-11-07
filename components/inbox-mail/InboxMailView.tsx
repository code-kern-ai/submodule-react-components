
import { useEffect, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail } from "./types-mail";
import { getInboxMessages } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus } from "../kern-icons/icons";

export default function InboxMailView() {
    const [inboxMessages, setInboxMessages] = useState<InboxMail[]>([]);
    const [openCreateMail, setOpenCreateMail] = useState(false);
    const [selectedMail, setSelectedMail] = useState<InboxMail | null>(null);

    useEffect(() => {
        getInboxMessages((res) => setInboxMessages(res));
    }, []);

    return (
        <div className='pt-16'>
            <div className="flex items-center w-full justify-between mb-4 px-4 py-2 border border-gray-200">
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
                <KernButton
                    text="Send new mail"
                    icon={MemoIconPlus}
                    onClick={() => setOpenCreateMail(true)} />
            </div>

            {inboxMessages?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="text-2xl font-semibold mb-4">No Inbox Messages</div>
                    <div className="text-gray-500 mb-6">You have no messages in your inbox</div>
                </div>
            ) : <div className="grid grid-cols-2 gap-x-4">
                <div>
                    {inboxMessages.map((mail) => (
                        <div key={mail.id} className="border border-gray-300 rounded-lg p-2 m-4">
                            <div className="font-bold text-md mb-2">Subject: {mail.subject}</div>
                            <div className="text-sm text-gray-600 mb-4">From: {mail.sendFrom}</div>
                            <div className="text-gray-800">{mail.content}</div>
                        </div>
                    ))}
                </div>
                <div>
                    {selectedMail ? (
                        <>DISPLAY SEQUENCE OF MESSAGES</>
                    ) : <div className="flex flex-col items-center justify-center mt-20">
                        <div className="text-gray-500 mb-6">Select mail to see the details</div>
                    </div>}
                </div>
            </div>}

            <CreateNewMailModal open={openCreateMail} setOpen={setOpenCreateMail} />
        </div>

    )
}
