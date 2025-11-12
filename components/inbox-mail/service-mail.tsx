import { FetchType, jsonFetchWrapper } from "@/submodules/javascript-functions/basic-fetch";

export const BACKEND_BASE_URI = '/cognition-gateway';
const url = `${BACKEND_BASE_URI}/api/v1/inbox-mail`;

export function sendNewMail(recipientIds: string[], subject: string, content: string, isImportant: boolean, metaData: any, onResult: (result: any) => void, threadId?: string) {
    const body = JSON.stringify({ recipientIds, threadId, subject, content, isImportant, metaData });
    jsonFetchWrapper(url, FetchType.POST, onResult, body);
}

export function getInboxMessages(onResult: (result: any) => void) {
    jsonFetchWrapper(url, FetchType.GET, onResult);
}

export function getAccessibleSendToEmails(onResult: (result: any) => void) {
    const fetchUrl = `${url}/accessible-emails`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}

export function getInboxMailOverviewByThreadsPaginated(page: number, limit: number, onResult: (result: any) => void) {
    const fetchUrl = `${url}/overview?page=${page}&limit=${limit}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}

export function getInboxMailsByThread(threadId: string, onResult: (result: any) => void) {
    const fetchUrl = `${url}/thread/${threadId}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}
