import { useRef, useCallback } from "react";
import { safeConsoleError } from "../helpers/safe-log";

const audioCache = new Map<string, HTMLAudioElement>();

export function useSound(volume = 1) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const play = useCallback((src: string) => {
        if (!src) return;
        let audio = audioCache.get(src);

        if (!audio) {
            audio = new Audio(src);
            audio.volume = volume;
            audio.onerror = () => {
                safeConsoleError("Failed to load audio", src);
            };
            audioCache.set(src, audio);
        } else {
            audio.currentTime = 0;
            audio.volume = volume;
        }
        audioRef.current = audio;
        audio.play().catch((error) => {
            safeConsoleError("Failed to play audio", src, error);
        });
    }, [volume]);

    return play;
}