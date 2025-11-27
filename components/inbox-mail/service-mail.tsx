import { FetchType, jsonFetchWrapper } from "@/submodules/javascript-functions/basic-fetch";
import { InboxMailThreadSupportProgressState } from "./types-mail";
import { convertCamelToSnakeCase } from "@/submodules/javascript-functions/case-types-parser";

const url = `/refinery-gateway/api/v1`;

export function createInboxMailByThread(content: string, onResult: (result: any) => void, recipientIds?: string[], subject?: string, isImportant?: boolean, metaData?: any, threadId?: string, isAdminSupportThread?: boolean) {
    const fetchUrl = `${url}/inbox-mail`;
    const body = JSON.stringify({ recipientIds, threadId, subject, content, isImportant, metaData, isAdminSupportThread });
    jsonFetchWrapper(fetchUrl, FetchType.POST, onResult, body);
}


export function getInboxMailOverviewByThreadsPaginated(page: number, limit: number, onResult: (result: any) => void) {
    const fetchUrl = `${url}/inbox-mail/overview?page=${page}&limit=${limit}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}


export function getInboxMailsByThread(threadId: string, onResult: (result: any) => void) {
    const fetchUrl = `${url}/inbox-mail/thread/${threadId}`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}


export function updateInboxMailThreadProgress(threadId: string, progressState: InboxMailThreadSupportProgressState, onResult: (result: any) => void) {
    const fetchUrl = `${url}/inbox-mail/thread/${threadId}/progress`;
    const body = JSON.stringify({ progressState });
    jsonFetchWrapper(fetchUrl, FetchType.PUT, onResult, body);
}


export function deleteInboxMailById(mailId: string, onResult: (result: any) => void) {
    const fetchUrl = `${url}/inbox-mail/${mailId}`;
    jsonFetchWrapper(fetchUrl, FetchType.DELETE, onResult);
}


export function getNewInboxMailsInfo(onResult: (result: any) => void) {
    const fetchUrl = `${url}/inbox-mail/new`;
    jsonFetchWrapper(fetchUrl, FetchType.GET, onResult);
}

export function getUsers(
    onResult: (result: any) => void,
    includeAdmins?: boolean,
    includeEngineers?: boolean,
    limitedTeams?: boolean,
    orgId?: string
) {
    const searchParams = new URLSearchParams();
    if (includeAdmins) searchParams.append("include_admins", "true");
    if (includeEngineers) searchParams.append("include_engineers", "true");
    if (limitedTeams) searchParams.append("limited_teams", "true");
    if (orgId) searchParams.append("org_id", orgId);

    const finalUrl = `${url}/organization/all-users${searchParams.toString() ? `?${searchParams}` : ""}`;
    jsonFetchWrapper(finalUrl, FetchType.GET, onResult);
}


export function getUserInfoExtended(onResult: (result: any) => void) {
    const finalUrl = `${url}/organization/get-user-info-extended`;
    jsonFetchWrapper(finalUrl, FetchType.GET, onResult);
}


export function getIsAdmin(onResult: (result: any) => void) {
    const finalUrl = `${url}/misc/is-admin`;
    jsonFetchWrapper(finalUrl, FetchType.GET, onResult);
}


export function getAllOrganizations(onResult: (result: any) => void) {
    const finalUrl = `${url}/organization/all-organizations`;
    jsonFetchWrapper(finalUrl, FetchType.GET, onResult);
}

export function addUserToOrganization(userMail: string, organizationName: string, onResult: (result: any) => void) {
    const finalUrl = `${url}/organization/add-user-to-organization`;
    const body = { userMail, organizationName };
    jsonFetchWrapper(finalUrl, FetchType.POST, onResult, JSON.stringify(convertCamelToSnakeCase(body)));
}


export function removeUserFromOrganization(userMail: string, onResult: (result: any) => void) {
    const finalUrl = `${url}/organization/remove-user-from-organization`;
    jsonFetchWrapper(finalUrl, FetchType.POST, onResult, JSON.stringify({ "user_mail": userMail }));
}