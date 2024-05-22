import { useEffect, useMemo, } from 'react';
import { WebSocketsService } from './WebSocketsService';
import { NotificationSubscription, getConstWhitelist } from './web-sockets-helper';
import { Application, CurrentPage, CurrentPageSubKey } from './constants';

export function useWebsocket(application: Application, currentPage: CurrentPage, handleFunction: (msgParts: string[]) => void, projectId?: string, subKey?: CurrentPageSubKey) {

    const _projectId = useMemo(() => projectId || "GLOBAL", [projectId]);
    const _subKey = useMemo(() => subKey || CurrentPageSubKey.NONE, [subKey]);
    const _application = useMemo(() => application, [application]);
    const __whitelist = useMemo(() => getConstWhitelist(_application), [_application]);

    useEffect(() => {
        const nos: NotificationSubscription = {
            whitelist: __whitelist[currentPage][_subKey],
            func: handleFunction,
            projectId: _projectId
        }

        WebSocketsService.subscribeToNotification(currentPage, nos, _subKey);

        return () => WebSocketsService.unsubscribeFromNotification(currentPage, projectId, _subKey);
    }, [_projectId, _subKey, _application]);

    useEffect(() => {
        WebSocketsService.updateFunctionPointer(projectId, currentPage, handleFunction, subKey)
    }, [handleFunction]);


}
