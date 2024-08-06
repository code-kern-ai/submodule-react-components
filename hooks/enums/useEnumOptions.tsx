import { enumToArray, enumToArrayOptions } from '@/submodules/javascript-functions/general';
import { useMemo } from 'react';


export default function useEnumOptions<T>(enumObj: Object, options?: enumToArrayOptions): { name: string, value: T }[] {
    return useMemo(() => enumToArray(enumObj, options), []);
}
