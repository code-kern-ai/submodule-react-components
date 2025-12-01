import { MemoIconMail } from "@/submodules/react-components/components/kern-icons/icons";
import { useRouter } from "next/router";
import tinycolor from 'tinycolor2'
import { useNewMailCount } from "./helper";
import { useCallback, useMemo } from "react";

type InboxMailNavigatorProps = {
    forChatArea?: boolean;
    project?: { customerColorPrimary: string; id: string; };
    chatId?: string;
    refreshToken?: any;
}

export default function InboxMailNavigator(props: InboxMailNavigatorProps) {
    const router = useRouter();

    const navigateToMailPage = useCallback(() => {
        const chatIdParam = props.chatId ? `?chatId=${props.chatId}` : '';
        const projectIdParam = props.project ? props.chatId ? `&projectId=${props.project.id}` : `?projectId=${props.project.id}` : '';
        router.push(`/inbox-mail${chatIdParam}${projectIdParam}`);
    }, [props.chatId, props.project]);

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
        <button className={buttonClasses} onClick={navigateToMailPage}>
            <MemoIconMail />
            <InboxMailBadge forChatArea={props.forChatArea} refreshToken={props.refreshToken} />
        </button>
    </div>
}



interface NewMailBadgeProps {
    forChatArea?: boolean;
    refreshInterval?: number; // optional, default to 60000ms
    refreshToken?: any; // optional, to trigger refresh when changed
}

export function InboxMailBadge(props: NewMailBadgeProps) {
    const newMailCount = useNewMailCount(props.refreshInterval, props.refreshToken);

    if (newMailCount === 0) return;

    const badgeClasses = props.forChatArea
        ? 'top-0 right-0'
        : 'top-1 right-1';

    return (
        <div className={`absolute flex items-center justify-center w-3 h-3 bg-red-500 rounded-full text-white text-[0.625rem] font-bold pointer-events-none ${badgeClasses}`}>
            {newMailCount}
        </div>
    );
}

export function InboxMailTitleBadge(props: { newMailCount?: number, refreshToken?: any }) {
    return (
        <div className="relative inline-flex items-center pr-5">
            <span >Inbox Mail</span>
            <InboxMailBadge forChatArea={false} refreshToken={props.refreshToken} />
        </div>
    );
}