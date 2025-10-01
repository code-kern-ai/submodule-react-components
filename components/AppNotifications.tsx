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
    user: { role: UserRole; }
    forChatArea?: boolean;
}
// only last 3 are shown, id still needs to be counted up since the local storage is used to check if the notification was already shown
// key is used for i18n translation
const NOTIFICATIONS = [
    { id: 1, key: "release_1_8", link: "https://www.kern.ai/resources/product-updates/week-28" },
    { id: 2, key: "release_1_9", link: "https://www.kern.ai/resources/product-updates/week-37" }
]

export default function AppNotifications(props: AppNotificationsProps) {
    const { t, i18n } = useTranslation('projectOverview');
    const [lastSeenNotification, setLastSeenNotification] = useLocalStorage<number>('lastSeen', 'releaseNotification', undefined, -1);
    const [showNotifications, setShowNotifications] = useState(false);
    const justClickedOutsideRef = useRef(false); // to prevent showing the notifications if the user just clicked outside
    const refNotificationBox = useRef(null);
    useOnClickOutside(refNotificationBox, () => { setShowNotifications(false); justClickedOutsideRef.current = true; setTimeout(() => justClickedOutsideRef.current = false, 200); });
    const clickBell = useCallback(() => {
        if (justClickedOutsideRef.current) return; // if the user just clicked outside, don't show the notifications since the person is trying to close via bell icon
        setShowNotifications(true);
        setLastSeenNotification(NOTIFICATIONS[NOTIFICATIONS.length - 1].id);
    }, []);

    const finalNotifications = useMemo(() => NOTIFICATIONS.slice(-3).map((e) => (
        {
            ...e,
            headline: t("notificationBell." + e.key + ".headline", props.user?.role == UserRole.ENGINEER ? { lng: "en" } : undefined),
            description: t("notificationBell." + e.key + ".description", props.user?.role == UserRole.ENGINEER ? { lng: "en" } : undefined)
        })), [NOTIFICATIONS, i18n.language, props.user?.role]);

    const hasNewNotifications = useMemo(() => {
        if (lastSeenNotification === -1) return true; // if no notification was seen
        return finalNotifications.some(notification => notification.id > lastSeenNotification);
    }, [lastSeenNotification, finalNotifications]);

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
        {showNotifications && <div className={combineClassNames("absolute overflow-hidden -translate-y-2 bottom-full left-0 w-72 rounded-lg bg-slate-50 shadow-lg z-10", props.forChatArea ? '' : 'translate-x-2', props.forChatArea ? 'bg-[var(--background-color-menu)]' : '')} ref={refNotificationBox}>
            <div className="flex flex-col">
                <div className="bg-gray-800/25"><div className="uppercase py-2 px-3">{t("notificationBell.header", props.user?.role == UserRole.ENGINEER ? { lng: "en" } : undefined)}</div></div>
                {finalNotifications.map((notification, idx) => (
                    <div key={notification.id} className={combineClassNames("py-4 px-3", idx == finalNotifications.length - 1 ? '' : 'border-b border-slate-400')}>
                        <div className="font-semibold">{notification.headline}</div>
                        <div className="text-xs line-clamp-3">{notification.description}</div>
                        <Link
                            href={notification.link}
                            className={'text-xs mt-1' + (isLightDesign ? ' text-red-800' : ' text-red-600')}
                            target="_blank"
                        >{t("notificationBell.link", props.user?.role == UserRole.ENGINEER ? { lng: "en" } : undefined)}</Link>
                    </div>
                ))}
            </div>
        </div>
        }
    </div>
}
