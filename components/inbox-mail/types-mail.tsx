export type InboxMail = {
    id: string;
    threadId: string;
    senderId: string;
    content: string;
    createdAt: string;
    isSeen: boolean;
    senderName?: {
        first: string;
        last: string;
    };
    recipientNames?: {
        first: string;
        last: string;
    }[];
}

export type InboxMailThread = {
    id: string;
    createdBy: string;
    organizationId: string;
    subject: string;
    isImportant: boolean;
    isAdminSupportThread: boolean;
    participantIds: string[];
    latestMail: InboxMail;
    organizationName: string;
    progressState?: string;
    supportOwnerId?: string;
    metaData?: any;
    unreadMailCount?: number;
    projectName?: string;
    conversationHeader?: string;
    display?: {
        displayName: string;
        displayInitials: string;
        background: string;
        text: string;
        recipientIds: string[];
        DisplayIcon?: React.FC;
    }
}

export type Settings = {
    soundName: string;
    onlyForLongTasks: boolean;
    onlyIfNotInFocus: boolean;
}


export type User = {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    mail: string;
    role: string;
    languageDisplay: string;
    logoutUrl: string;
    isAdmin: boolean;
    autoLogoutMinutes: number;
    soundSettings: Settings;
    notificationSettings: Settings;
}


export enum InboxMailThreadSupportProgressState {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}