
import { useState } from "react";
import KernButton from "../components/kern-button/KernButton";
import { MemoIconPlus } from "../components/kern-icons/icons";
import CreateNewMailModal from "./CreateNewMailModal";

export default function InboxMailView() {
    const [inboxMessages, setInboxMessages] = useState([]);
    const [openCreateMail, setOpenCreateMail] = useState(false);

    return (
        <div className='pt-16'>
            <div className="flex justify-end p-4">
                <KernButton
                    text="Send new mail"
                    icon={MemoIconPlus}
                    onClick={() => setOpenCreateMail(true)} />
            </div>

            {inboxMessages?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="text-2xl font-semibold mb-4">No Inbox Messages</div>
                    <div className="text-gray-500 mb-6">You have no messages in your inbox.</div>
                </div>
            )}
            <CreateNewMailModal open={openCreateMail} setOpen={setOpenCreateMail} />
        </div>

    )
}
