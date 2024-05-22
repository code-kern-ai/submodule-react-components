import { useEffect, useMemo, } from 'react';
import { WebSocketsService } from './WebSocketsService';
import { CurrentPage, CurrentPageSubKey, NotificationSubscription, WHITELIST_LOOKUP_REFINERY } from './web-sockets-helper';

export function useWebsocket(currentPage: CurrentPage, handleFunction: (msgParts: string[]) => void, projectId?: string, subKey?: CurrentPageSubKey) {

    const _projectId = useMemo(() => projectId || "GLOBAL", [projectId]);
    const _subKey = useMemo(() => subKey || CurrentPageSubKey.NONE, [subKey]);
    useEffect(() => {
        const nos: NotificationSubscription = {
            whitelist: WHITELIST_LOOKUP_REFINERY[currentPage][_subKey],
            func: handleFunction,
            projectId: _projectId
        }

        WebSocketsService.subscribeToNotification(currentPage, nos, _subKey);

        return () => WebSocketsService.unsubscribeFromNotification(currentPage, projectId, _subKey);
    }, [_projectId, _subKey]);

    useEffect(() => {
        WebSocketsService.updateFunctionPointer(projectId, currentPage, handleFunction, subKey)
    }, [handleFunction]);


}
