import { Dispatch, SetStateAction } from "react";
import { CurrentPage } from "../hooks/web-socket/constants";

export type AdminMessage = {
    id: string;
    text: string;
    archiveDate: string;
    level: AdminMessageLevel;
    displayDate: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
    createdAt: string;
    visible: boolean;
    scheduledDate: string;
};

export enum AdminMessageLevel {
    INFO = 'info',
    WARNING = 'warning'
};

export type AdminMessagesProps = {
    adminMessages: AdminMessage[];
    currentPage?: CurrentPage;
    setActiveAdminMessages: Dispatch<SetStateAction<AdminMessage[]>>
    maxWidth?: string;
}