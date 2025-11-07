export type InboxMail = {
    id: string;
    sendFrom: string;
    sendTo: string[];
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