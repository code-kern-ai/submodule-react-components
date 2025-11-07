import { FetchType, jsonFetchWrapper } from "@/submodules/javascript-functions/basic-fetch";

export const BACKEND_BASE_URI = '/cognition-gateway';
const url = `${BACKEND_BASE_URI}/api/v1/inbox-mail`;

export function sendNewMail(sendTo: string[], subject: string, content: string, markAsImportant: boolean, metaData: any, onResult: (result: any) => void) {
    const body = JSON.stringify({ sendTo, subject, content, markAsImportant, metaData });
    jsonFetchWrapper(url, FetchType.POST, onResult, body);
}

export function getInboxMessages(onResult: (result: any) => void) {
    jsonFetchWrapper(url, FetchType.GET, onResult);
}

export function getAccessibleSendToEmails(onResult: (result: any) => void) {
    const fetchUrl = `${url}/accessible-emails`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}