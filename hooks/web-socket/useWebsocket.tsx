import { useEffect, useMemo, } from 'react';
import { WebSocketsService } from './WebSocketsService';
import { NotificationSubscription, getConstWhitelist } from './web-sockets-helper';
import { Application, CurrentPage, CurrentPageSubKey } from './constants';

export function useWebsocket(application: Application, currentPage: CurrentPage, handleFunction: (msgParts: string[]) => void, projectId?: string, subKey?: CurrentPageSubKey) {

    const _projectId = useMemo(() => projectId || "GLOBAL", [projectId]);
    const _subKey = useMemo(() => subKey || CurrentPageSubKey.NONE, [subKey]);
    const __whitelist = useMemo(() => getConstWhitelist(application), [application]);

    useEffect(() => {
        if (!__whitelist[currentPage]) {
            console.error(`The combination of ${currentPage} and ${application} does not exist in the whitelist`);
            return;
        }
        const nos: NotificationSubscription = {
            whitelist: __whitelist[currentPage][_subKey],
            func: handleFunction,
            projectId: _projectId
        }

        WebSocketsService.subscribeToNotification(currentPage, nos, _subKey);

        return () => WebSocketsService.unsubscribeFromNotification(currentPage, projectId, _subKey);
    }, [_projectId, _subKey, application]);

    useEffect(() => {
        WebSocketsService.updateFunctionPointer(projectId, currentPage, handleFunction, subKey)
    }, [handleFunction]);


}
