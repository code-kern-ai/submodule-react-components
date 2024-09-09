import { Application, CurrentPage, CurrentPageSubKey, WHITELIST_LOOKUP_COGNITION, WHITELIST_LOOKUP_REFINERY, WHITE_LIST_LOOKUP_ADMIN_DASHBOARD, WHITE_LIST_LOOKUP_ENTRY, WHITE_LIST_LOOKUP_WELCOME_SCREEN } from "./constants";

export type NotificationSubscription = {
    projectId?: string;
    whitelist?: string[];
    func: (msg) => void;
};

export type NotificationScope = {
    projectId: string // uuid | "GLOBAL";
    page: CurrentPage,
    subKey?: CurrentPageSubKey | string
};

const stablePageKeyCache = new Map<string, NotificationScope>();

export function getStableWebsocketPageKey(projectId: string, page: CurrentPage, subKey?: CurrentPageSubKey | string): NotificationScope {
    const _subKey = subKey || "NONE";
    const lookupKey = `${projectId}_${page}_${_subKey}`;
    if (!stablePageKeyCache.has(lookupKey)) {
        stablePageKeyCache.set(lookupKey, { projectId, page, subKey: _subKey });
    }
    return stablePageKeyCache.get(lookupKey);
}


export function getConstWhitelist(application: Application) {
    let whiteListString;
    switch (application) {
        case Application.REFINERY: whiteListString = WHITELIST_LOOKUP_REFINERY; break;
        case Application.COGNITION: whiteListString = WHITELIST_LOOKUP_COGNITION; break;
        case Application.ENTRY: whiteListString = WHITE_LIST_LOOKUP_ENTRY; break;
        case Application.ADMIN_DASHBOARD: whiteListString = WHITE_LIST_LOOKUP_ADMIN_DASHBOARD; break;
    }
    return whiteListString;
}