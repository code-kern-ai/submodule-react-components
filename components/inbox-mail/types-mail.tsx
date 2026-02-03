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
    soundName?: string;
    enabled?: boolean;
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

export enum JumpDestination {
    CONVERSATION = "CONVERSATION",
    PROJECT = "PROJECT",
    ORGANIZATION = "ORGANIZATION"
}

export enum InboxMailFilter {
    ALL = "ALL",
    UNREAD = "UNREAD",
    IMPORTANT = "IMPORTANT",
    SUPPORT_PENDING = "SUPPORT_PENDING",
    SUPPORT_IN_PROGRESS = "SUPPORT_IN_PROGRESS",
    SUPPORT_RESOLVED = "SUPPORT_RESOLVED",
    ONLY_USER_THREADS = "ONLY_USER_THREADS",
    ONLY_SYSTEM_THREADS = "ONLY_SYSTEM_THREADS"
}

export const SUPPORT_FILTERS = [InboxMailFilter.SUPPORT_PENDING, InboxMailFilter.SUPPORT_IN_PROGRESS, InboxMailFilter.SUPPORT_RESOLVED];
export const THREAD_TYPE_FILTERS = [InboxMailFilter.ONLY_USER_THREADS, InboxMailFilter.ONLY_SYSTEM_THREADS];