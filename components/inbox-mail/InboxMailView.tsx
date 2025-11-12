
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateNewMailModal from "./CreateNewMailModal";
import { InboxMail } from "./types-mail";
import { getInboxMessages, getInboxMailOverviewByThreadsPaginated, getInboxMailsByThread } from "./service-mail";
import KernButton from "../kern-button/KernButton";
import { MemoIconPlus } from "../kern-icons/icons";
import { IconUser } from "@tabler/icons-react";


const MAIL_LIMIT_PER_PAGE = 10;

export interface User {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    mail: string;
    role: string;
    languageDisplay: string;
    logoutUrl: string;
    isAdmin: boolean;
    autoLogoutMinutes: number;
}

export default function InboxMailView(props: { currentUser, orgUsers }) {
    const [inboxMailThreads, setInboxMailThreads] = useState([]);
    const [openCreateMail, setOpenCreateMail] = useState(false);
    const [isNewThread, setIsNewThread] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedThread, setSelectedThread] = useState(null);
    const [threadMails, setThreadMails] = useState<InboxMail[]>([]);

    useEffect(() => {
        refetchInboxMailOverview();
    }, []);

    const refetchInboxMailOverview = useCallback(() => {
        getInboxMailOverviewByThreadsPaginated(currentPage, MAIL_LIMIT_PER_PAGE, (res) =>
            setInboxMailThreads(res.threads));
    }, [currentPage]);



    useEffect(() => {
        if (!selectedThread) return
        getInboxMailsByThread(selectedThread.threadId, (res) => {
            setThreadMails(res);
        })
    }, [selectedThread]);


    const userById = useMemo(() => {
        const map: { [key: string]: { id: string; firstName: string; lastName: string; email: string } } = {};
        props.orgUsers?.forEach(user => {
            map[user.id] = user;
        });
        return map;
    }, [props.orgUsers]);

    if (!props.currentUser) return;

    return (
        <div className='pt-16'>
            <div className="flex items-center w-full justify-between mb-2 px-4 py-2 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold">
                            Inbox Mail
                        </h2>
                        <p>
                            Manage your inbox messages.
                        </p>
                    </div>
                </div>
                <KernButton
                    text="Send new mail"
                    icon={MemoIconPlus}
                    onClick={() => {
                        setIsNewThread(true);
                        setOpenCreateMail(true);
                    }} />
            </div>

            {inboxMailThreads?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="text-2xl font-semibold mb-4">No Inbox Messages</div>
                    <div className="text-gray-500 mb-6">You have no messages in your inbox</div>
                </div>
            ) : <div className="grid grid-cols-3 gap-x-4 p-3">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-lg ">
                        {inboxMailThreads.map((thread) => {
                            const latestMail = thread.latestMail;
                            const relevantUserIdThreadOverview =
                                latestMail.senderId === props.currentUser.id
                                    ? latestMail.recipientId
                                    : latestMail.senderId;

                            const { background, text } = uuidToPastelColorWithMatchingFont(relevantUserIdThreadOverview);
                            const initials = userById[relevantUserIdThreadOverview]
                                ? userById[relevantUserIdThreadOverview].firstName[0] + userById[relevantUserIdThreadOverview].lastName[0]
                                : <IconUser />;

                            return (

                                <div
                                    key={thread.threadId}
                                    className={`flex flex-col py-3 px-4 border-b border-gray-200 last:border-b-0 first:rounded-t-lg last:rounded-b-lg cursor-pointer  transition-all transition-duration-150 ${selectedThread?.threadId === thread.threadId ? 'bg-slate-100 ' : 'hover:bg-slate-50'}`}
                                    onClick={() => setSelectedThread(thread)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div style={{ backgroundColor: background, color: text }} className="self-start shrink-0 mt-1  flex items-center justify-center w-10 h-10 border rounded-md p-2 text-sm font-semibold">
                                            {initials}
                                        </div>
                                        <div className="grow min-w-0">
                                            <div className="flex items-center justify-between gap-x-2 flex-nowrap">
                                                <div className="text-gray-800 font-medium truncate">
                                                    {userById[relevantUserIdThreadOverview]
                                                        ? userById[relevantUserIdThreadOverview].firstName + " " + userById[relevantUserIdThreadOverview].lastName
                                                        : "<Unknown User>"}
                                                </div>
                                                <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                                                    {formatDisplayTimestamp(latestMail.createdAt)}
                                                </div>
                                            </div>

                                            <div className="text-gray-800 font-medium truncate">
                                                {latestMail.subject}
                                            </div>

                                            <div className="text-gray-500 truncate">
                                                {latestMail.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
                <div className="col-span-2">
                    {selectedThread && threadMails && threadMails.length > 0 ? (
                        threadMails.map(mail => (
                            <div key={mail.id} className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="grow min-w-0">
                                        <h3 className="text-xl font-semibold text-gray-800">{mail.subject}</h3>
                                        <div className="flex items-center justify-between gap-x-2 flex-nowrap">
                                            <span className="font-medium text-gray-700">{userById[mail.senderId]?.firstName} {userById[mail.senderId]?.lastName}</span>
                                            <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                                                {formatDisplayTimestampFull(mail.createdAt)}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500">To: {userById[mail.recipientId]?.firstName} {userById[mail.recipientId]?.lastName}</span>

                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mt-4 pt-4 text-gray-700 whitespace-pre-line">
                                    {mail.content}
                                </div>

                                <div className="mt-6 flex items-center justify-end space-x-3">
                                    <KernButton
                                        text="Reply"
                                        onClick={() => {
                                            setIsNewThread(false);
                                            setOpenCreateMail(true);
                                        }}
                                    />
                                    <KernButton
                                        text="Delete"
                                        onClick={() => {/* delete handler here */ }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : <div className="flex flex-col items-center justify-center mt-20">
                        <div className="text-gray-500 mb-6">Select mail to see the details</div>
                    </div>}
                </div>

            </div>}

            <CreateNewMailModal open={openCreateMail} setOpen={setOpenCreateMail} threadId={selectedThread?.threadId} isNewThread={isNewThread} refetchInboxMailOverview={refetchInboxMailOverview} users={props.orgUsers} />
        </div>

    )
}


// Helper, export later if needed elsewhere
function formatDisplayTimestamp(createdAt: string | Date): string {
    const date = new Date(createdAt);
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    if (isSameDay(date, now)) {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(date, yesterday)) {
        return "Yesterday";
    }

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${weekday}, ${day}.${month}.${year}`;
}

function formatDisplayTimestampFull(createdAt: string | Date): string {
    const date = new Date(createdAt);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    let relative = "";
    if (diffMinutes < 1) {
        relative = "(just now)";
    } else if (diffMinutes < 60) {
        relative = `(${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago)`;
    } else if (diffHours < 24 && isSameDay(date, now)) {
        relative = `(${diffHours} hour${diffHours !== 1 ? "s" : ""} ago)`;
    } else {
        relative = `(${diffDays} day${diffDays !== 1 ? "s" : ""} ago)`;
    }

    return `${weekday}, ${day}.${month}.${year} ${hours}:${minutes} ${relative}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

function uuidToPastelColorWithMatchingFont(uuid: string): { background: string; text: string } {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
        hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
    }

    const hue = hash % 360;
    const saturation = 40 + (hash % 15); // 40–55%
    const lightness = 70 + (hash % 10);  // 70–80%
    const background = hslToHex(hue, saturation, lightness);

    const textLightness = lightness - 40;
    const text = hslToHex(hue, saturation, clamp(textLightness, 20, 90));
    return { background, text };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = (x: number) =>
        Math.round(255 * x)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}