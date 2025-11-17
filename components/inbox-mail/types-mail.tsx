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
    subject: string;
    isImportant: boolean;
    isAdminSupportThread: boolean;
    participantIds: string[];
    latestMail: InboxMail;
    display?: {
        displayName: string;
        displayInitials: string;
        background: string;
        text: string;
        recipientIds: string[];
    }
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
}