import { FetchType, jsonFetchWrapper } from "@/submodules/javascript-functions/basic-fetch";

export const BACKEND_BASE_URI = '/cognition-gateway';
const url = `${BACKEND_BASE_URI}/api/v1/inbox-mail`;

export function createInboxMailByThread(content: string, onResult: (result: any) => void, recipientIds?: string[], subject?: string, isImportant?: boolean, metaData?: any, threadId?: string, isAdminSupportThread?: boolean) {
    const body = JSON.stringify({ recipientIds, threadId, subject, content, isImportant, metaData, isAdminSupportThread });
    jsonFetchWrapper(url, FetchType.POST, onResult, body);
}

export function getInboxMailOverviewByThreadsPaginated(page: number, limit: number, onResult: (result: any) => void) {
    const fetchUrl = `${url}/overview?page=${page}&limit=${limit}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}

export function getInboxMailsByThread(threadId: string, onResult: (result: any) => void) {
    const fetchUrl = `${url}/thread/${threadId}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}
