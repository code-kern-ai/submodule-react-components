import { combineClassNames } from "@/submodules/javascript-functions/general";
import { MemoIconBell } from "@/submodules/react-components/components/kern-icons/icons";
import useOnClickOutside from "@/submodules/react-components/hooks/useHooks/useOnClickOutside";
import { useLocalStorage } from "@/submodules/react-components/hooks/useLocalStorage";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import tinycolor from 'tinycolor2'
import { useTranslation } from "react-i18next";
import { UserRole } from "@/submodules/javascript-functions/enums/enums";

type AppNotificationsProps = {
    project: { customerColorPrimary: string; }
    user: { role: UserRole; languageDisplay: string; };
    forChatArea?: boolean;
    notifications: any[];
}

const MIN_NOTIFICATIONS_SHOW = 3;
const MAX_NOTIFICATIONS_SHOW = 7;

export default function AppNotifications(props: AppNotificationsProps) {
    const { t } = useTranslation('projectOverview');
    const [lastSeenNotification, setLastSeenNotification] = useLocalStorage<number>('lastSeen', 'releaseNotification', undefined, -1);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMoreClicked, setShowMoreClicked] = useState(false);
    const justClickedOutsideRef = useRef(false); // to prevent showing the notifications if the user just clicked outside
    const refNotificationBox = useRef(null);
    useOnClickOutside(refNotificationBox, () => { setShowNotifications(false); justClickedOutsideRef.current = true; setTimeout(() => justClickedOutsideRef.current = false, 200); });

    const clickBell = useCallback(() => {
        if (justClickedOutsideRef.current) return; // if the user just clicked outside, don't show the notifications since the person is trying to close via bell icon
        setShowNotifications(true);
        if (props.notifications.length === 0) return;
        setLastSeenNotification(props.notifications[props.notifications.length - 1].id);
    }, [props.notifications]);

    const finalNotifications = useMemo(() => {
        if (props.notifications.length <= MIN_NOTIFICATIONS_SHOW) return props.notifications;
        if (!showMoreClicked) return props.notifications.slice(-MIN_NOTIFICATIONS_SHOW);
        if (showMoreClicked) return props.notifications.slice(-MAX_NOTIFICATIONS_SHOW);
    }, [props.notifications, showMoreClicked]);

    const hasNewNotifications = useMemo(() => {
        if (lastSeenNotification === -1) return true; // if no notification was seen
        return props.notifications.some(notification => notification.id > lastSeenNotification);
    }, [lastSeenNotification, props.notifications]);

    const isLightDesign = useMemo(() => tinycolor(props.project?.customerColorPrimary).isLight(), [props.project?.customerColorPrimary]);

    const buttonClasses = useMemo(() => {
        if (props.forChatArea) {
            const classes = "items-center justify-center w-8 h-8 border group flex -x-3 rounded-md p-1 text-sm leading-6 font-semibold"
            if (isLightDesign) return 'bg-gray-100 text-gray-700 border-gray-300 ' + classes;
            else return 'bg-zinc-900 text-zinc-100 border-zinc-700 ' + classes;
        }
        return "text-gray-400 hover:text-green-600 hover:bg-zinc-800 border-gray-700 items-center justify-center w-10 h-10 border group flex -x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    }, [props.forChatArea, isLightDesign]);

    return <div className="relative">
        <button className={buttonClasses} onClick={clickBell}>
            <MemoIconBell />
        </button>
        {hasNewNotifications && <div className={combineClassNames("absolute w-2 h-2 bg-red-500 rounded-full pointer-events-none", props.forChatArea ? 'top-1 right-1' : 'top-2 right-2')}></div>}
        {showNotifications && <div className={combineClassNames("absolute overflow-hidden -translate-y-2 bottom-full left-0 w-72 rounded-lg bg-slate-50 shadow-lg z-10 text-gray-700", props.forChatArea ? '' : 'translate-x-2', props.forChatArea ? 'bg-[var(--background-color-menu)]' : '')} ref={refNotificationBox}>
            <div className="flex flex-col">
                <div className="bg-gray-800/25 text-gray-900"><div className="uppercase py-2 px-3">{t("notificationBell.header")}</div></div>
                {finalNotifications.map((notification, idx) => (
                    <div key={notification.id} className={combineClassNames("py-4 px-3", idx == finalNotifications.length - 1 ? '' : 'border-b border-slate-400')}>
                        <div className="font-semibold">{notification.config[props.user?.languageDisplay].headline}</div>
                        <div className="text-xs line-clamp-3">{notification.config[props.user?.languageDisplay].description}</div>
                        <Link
                            href={notification.link}
                            className={'text-xs mt-1' + (isLightDesign ? ' text-red-800' : ' text-red-600')}
                            target="_blank"
                        >{t("notificationBell.link")}</Link>
                    </div>
                ))}
                {finalNotifications.length === 0 && <div className="py-4 px-3 text-sm text-gray-500">{t("notificationBell.noNotifications")}</div>}
            </div>
            {props.notifications.length > MIN_NOTIFICATIONS_SHOW && <div className="py-1 px-3 bg-gray-800/25 text-center">
                <label className="text-xs text-gray-900 cursor-pointer" onClick={() => setShowMoreClicked(!showMoreClicked)}>{!showMoreClicked ? t("notificationBell.showMore") : t("notificationBell.showLess")}</label>
            </div>}
        </div>
        }
    </div>
}
