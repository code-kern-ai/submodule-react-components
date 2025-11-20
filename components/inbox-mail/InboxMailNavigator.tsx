import { MemoIconMail } from "@/submodules/react-components/components/kern-icons/icons";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState, useEffect } from "react";
import tinycolor from 'tinycolor2'
import { getNewInboxMailsInfo } from "./service-mail";
import { combineClassNames } from "@/submodules/javascript-functions/general";
import { useNewMailCount } from "./helper";

type InboxMailProps = {
    project: { customerColorPrimary: string; id: string; };
    forChatArea?: boolean;
    chatId?: string;
}

export default function InboxMailNavigator(props: InboxMailProps) {
    const router = useRouter();
    const newMailCount = useNewMailCount(60000);

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
            {newMailCount > 0 && (
                <div className={combineClassNames(
                    "absolute flex items-center justify-center w-3 h-3 bg-red-500 rounded-full text-white text-[0.625rem] font-bold pointer-events-none",
                    props.forChatArea ? 'top-0 right-0' : 'top-1 right-1'
                )}>
                    {newMailCount}
                </div>
            )}
        </button>
    </div>
}
