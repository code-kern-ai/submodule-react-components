import { enumToArray, enumToArrayOptions } from '@/submodules/javascript-functions/general';
import { useMemo } from 'react';


export default function useEnumOptions<T>(enumObj: T, options?: enumToArrayOptions): { name: string, value: T }[] {
    // const { t, i18n } = useTranslation(translationScope);
    const values = useMemo(() => enumToArray(enumObj, options), []);
    return values;
}
