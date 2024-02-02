import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type ItemWithExpiration<T> = {
  value: T;
  expiration?: number;
};

export function readItemGroupFromLocalStorage(group: string): any {
  if (typeof localStorage !== 'undefined') {
    const itemGroupString = localStorage.getItem(group);
    if (itemGroupString) {
      return JSON.parse(itemGroupString);
    }
  }
  return {};
}

export function useLocalStorage<T>(
  key: string,
  group: string,
  timeoutSeconds?: number,
  defaultValue?: T
): [T | null, Dispatch<SetStateAction<T>>] {

  const [state, setState] = useState<T | any>(() => {
    const itemGroup = readItemGroupFromLocalStorage(group)
    if (itemGroup) {
      const item = itemGroup[key];
      if (item) {
        if (item.expiration && Date.now() > item.expiration) {
          // Item has expired, remove it
          delete itemGroup[key];
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(group, JSON.stringify(itemGroup));
          }
        } else {
          return item.value;
        }
      }
    }
    if (defaultValue) return defaultValue;
    return null;
  });

  useEffect(() => {
    const itemGroup = readItemGroupFromLocalStorage(group);
    const item: ItemWithExpiration<T> = {
      value: state!,
      expiration: timeoutSeconds ? Date.now() + timeoutSeconds * 1000 : null,
    };
    itemGroup[key] = item;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(group, JSON.stringify(itemGroup));
    }
  }, [state]);

  return [state, setState];
}
