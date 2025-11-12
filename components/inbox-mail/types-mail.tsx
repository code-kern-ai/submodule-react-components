export type InboxMail = {
    id: string;
    threadId: string;
    senderId: string;
    recipientId: string;
    subject: string;
    content: string;
    beingWorkedOn: boolean;
    childId: string;
    parentId: string;
    createdAt: string;
    isSeen: boolean;
    metaData: any;
    organizationId: string;
    markAsImportant: boolean;
}