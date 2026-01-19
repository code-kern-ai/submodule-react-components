import { useRef } from "react";

export function useSound(volume = 1) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const play = (src: string) => {
        if (!src) return;
        audioRef.current = new Audio(src);
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => { });
    };

    return play;
}