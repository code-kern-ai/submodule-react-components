import { enumToArray } from '@/submodules/javascript-functions/general';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';


const cache = {};

function getEnumOptionsForLanguage<T>(enumObj: T, lookupKey: string, t: any, language: string): { name: string, value: T }[] {
    if (!(lookupKey in cache)) cache[lookupKey] = {};
    if (cache[lookupKey][language]) return cache[lookupKey][language];
    const finalArray = enumToArray(enumObj, { nameFunction: (s) => { return t(`${lookupKey}.${s}`) } });
    cache[lookupKey][language] = finalArray;
    return cache[lookupKey][language];
}

// unfortunately we need to provide the lookupKey ourselves which is the Enum name itself.
// there is no way to get the name of the enum at runtime since they are compiled away
// https://stackoverflow.com/a/59824941/19801189
export default function useEnumOptionsTranslated<T>(enumObj: T, lookupKey: string, translationScope: string): { name: string, value: T }[] {
    const { t, i18n } = useTranslation(translationScope);
    const values = useMemo(() => getEnumOptionsForLanguage(enumObj, lookupKey, t, i18n.language), [i18n.language]);
    return values;
}
