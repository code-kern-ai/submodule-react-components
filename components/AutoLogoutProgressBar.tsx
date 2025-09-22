import { selectTempValue, setTempVariable, TempStorageEnum } from "@/src/reduxStore/states/temps";
import { selectUser } from "@/src/reduxStore/states/user";
import { logout } from "@/src/services/auth";
import { formatTime } from "@/submodules/javascript-functions/date-parser";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

type AutoLogoutProgressBarProps = {
    className?: string;
}

function isReload() {
    if ("performance" in window) {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
            return navEntries[0].type === "reload";
        }
        return (performance as any).navigation?.type === 1;
    }
    return false;
};

export default function AutoLogoutProgressBar(props: AutoLogoutProgressBarProps) {
    const dispatch = useDispatch();
    const { t } = useTranslation('projectOverview');

    const user = useSelector(selectUser);

    const [showProgressBar, setShowProgressBar] = useState(false);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [completeCalled, setCompleteCalled] = useState(false);

    const lastInteractionRef = useRef(Date.now());

    useEffect(() => {
        const resetTimer = () => {
            lastInteractionRef.current = Date.now();
            dispatch(setTempVariable(TempStorageEnum.RESET_LOGOUT_TIMER, "X"));
        }

        const onKeyDownEvent = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // used for the chat input (we want to trigger rest on typing)
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
                resetTimer();
            }
        };

        window.addEventListener("click", resetTimer);
        window.addEventListener("keydown", onKeyDownEvent);
        return () => {
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("keydown", onKeyDownEvent);
        };
    }, []);

    useEffect(() => {
        const autoLogoutMinutes = user?.autoLogoutMinutes;
        if (!autoLogoutMinutes) {
            setShowProgressBar(false);
            setRemainingMinutes(0);
            return;
        }

        setRemainingMinutes(Math.ceil(autoLogoutMinutes));

        const checkInactivity = () => {
            const now = Date.now();
            const inactiveMinutes = (now - lastInteractionRef.current) / 1000 / 60;
            const minutesLeft = autoLogoutMinutes - inactiveMinutes;
            setShowProgressBar(minutesLeft <= 5 && minutesLeft > 0);
        };

        checkInactivity();
        const interval = setInterval(checkInactivity, 1000);
        return () => clearInterval(interval);
    }, [user?.autoLogoutMinutes]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("lastClosedAt");
        logout();
    }, []);

    const onCompleteFunc = useCallback(() => {
        setCompleteCalled(true);
        logoutUser();
        setTimeout(() => {
            setCompleteCalled(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (isReload()) return;
        const handleBeforeUnload = () => {
            const nowIso = new Date().toISOString();
            if (!localStorage.getItem("lastClosedAt") && !completeCalled) localStorage.setItem("lastClosedAt", nowIso);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        const stored = localStorage.getItem("lastClosedAt");
        if (stored) {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            logoutUser();
        }
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [completeCalled]);

    return <>
        {showProgressBar && <ReverseProgressBar duration={remainingMinutes * 60} className={props.className} label={t("overview.remainingTime")} onComplete={onCompleteFunc} />}
    </>
}

type ReverseProgressBarProps = {
    duration: number;
    onComplete: () => void;
    label: string;
    className?: string;
};

function ReverseProgressBar(props: ReverseProgressBarProps) {
    const dispatch = useDispatch();
    const resetLogoutTimer = useSelector(selectTempValue(TempStorageEnum.RESET_LOGOUT_TIMER));
    const [remaining, setRemaining] = useState<number>(props.duration);

    useEffect(() => {
        if (!resetLogoutTimer) return;
        dispatch(setTempVariable(TempStorageEnum.RESET_LOGOUT_TIMER, null));
        setRemaining(props.duration);
    }, [resetLogoutTimer]);

    useEffect(() => {
        setRemaining(props.duration);

        const tick = () => {
            setRemaining(prev => {
                if (prev - 1 <= 0) {
                    if (props.onComplete) props.onComplete();
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        };
        const interval = setInterval(tick, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [props.duration, props.onComplete]);

    const progressPercent = useMemo(() => {
        return Math.max(0, Math.min(100, (remaining / Math.max(1, props.duration)) * 100));
    }, [remaining, props.duration]);

    return (
        <div className={`w-full max-w-3xs ml-auto ${props.className}`}>
            <div className="relative w-full h-5 bg-gray-200 rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                <div
                    style={{ width: `${100 - progressPercent}%` }}
                    className="absolute top-0 bottom-0 right-0 bg-gray-200"
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium tabular-nums">
                    {formatTime(remaining)}
                </div>
            </div>
            {props.label && <div className="mt-2 text-xs text-gray-500 italic text-center">{props.label}</div>}
        </div>
    );
}
