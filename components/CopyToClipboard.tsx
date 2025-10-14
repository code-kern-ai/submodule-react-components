import { copyToClipboard } from "@/submodules/javascript-functions/general";
import { MemoIconClipboard, MemoIconClipboardCheck } from "./kern-icons/icons";
import { useCallback, useState } from "react";
import useRefFor from "../hooks/useRefFor";

type CopyToClipboardProps = {
    nameToCopy: string;
}

export default function CopyToClipboard({ nameToCopy }: CopyToClipboardProps) {
    const [copiedFlag, setCopiedFlag] = useState(false);
    const nameToCopyRef = useRefFor(nameToCopy);

    const handleClickCopy = useCallback(() => {
        if (!nameToCopyRef.current) return;
        setCopiedFlag(true);
        copyToClipboard(nameToCopyRef.current);
        setTimeout(() => setCopiedFlag(false), 2000);
    }, []);

    return <>
        <MemoIconClipboard onClick={handleClickCopy} className={`w-4 h-4 cursor-pointer ${copiedFlag ? 'hidden' : ''}`} />
        <MemoIconClipboardCheck className={`w-4 h-4 cursor-pointer ${copiedFlag ? '' : 'hidden'}`} />
    </>
}