import { AdminMessageLevel, AdminMessagesProps } from "@/submodules/react-components/types/admin-messages";
import { CurrentPage } from "@/submodules/react-components/hooks/web-socket/constants";
import { IconAlertCircle, IconInfoSquare, IconPoint, IconX } from "@tabler/icons-react";
import { useMemo } from "react";

export default function AdminMessages(props: AdminMessagesProps) {
    const isOnLabelingPage = useMemo(() => props.currentPage == CurrentPage.LABELING, [props.currentPage]);

    function closeMessage(id: string) {
        const adminMessagesCopy = [...props.adminMessages];
        const index = adminMessagesCopy.findIndex((message) => message.id == id);
        adminMessagesCopy[index].visible = false;
        props.setActiveAdminMessages(adminMessagesCopy);
    }

    return (<div className={`pointer-events-none font-dm-sans flex-col right-0 fixed z-30 inset-y-0 sm:flex sm:justify-end sm:px-6 sm:pb-5 lg:px-8 ${isOnLabelingPage ? 'bottom-8' : 'bottom-0'}`}>
        {props.adminMessages && props.adminMessages.map((activeMessage, index) => (
            <div key={activeMessage.id} className={`pointer-events-auto items-center justify-between gap-x-6 py-2.5 mt-2 border px-6 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4 ${activeMessage.borderColor} ${activeMessage.backgroundColor} ${activeMessage.visible ? 'flex' : 'hidden'}`}
                style={{ maxWidth: props.maxWidth ?? 'calc(100vw - 200px)' }}>
                <div className={`text-sm leading-6 flex flex-row items-center w-full ${activeMessage.textColor}`}>
                    {activeMessage.level == AdminMessageLevel.INFO && <IconInfoSquare className="text-blue-700" size={24} />}
                    {activeMessage.level == AdminMessageLevel.WARNING && <IconAlertCircle className="text-yellow-700" size={24} />}
                    <strong className="font-semibold uppercase">{activeMessage.level}</strong><IconPoint className="mx-2" size={16} />
                    <strong className="font-semibold">{activeMessage.text}</strong>
                    {activeMessage.displayDate && <><IconPoint className="mx-2" size={16} /><div>Scheduled for {activeMessage.displayDate}</div></>}
                    <button type="button" className="-my-1.5 ml-auto mr-0 flex-none p-1.5" onClick={() => closeMessage(activeMessage.id)}>
                        <IconX className={`${activeMessage.textColor} cursor-pointer`} size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div >))
        }
    </div >)
}