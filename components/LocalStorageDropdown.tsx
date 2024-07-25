//wrapper around Dropdown to + input filed to read local storage data and provide it as dropdown options

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDefaults, useDefaultsByRef } from "../hooks/useDefaults";
import { CompareOptions, inStringList } from "@/submodules/javascript-functions/validations";
import { LOCAL_STORAGE_DROPDOWN_DEFAULTS, LocalStorageDropdownProps } from "../types/localStorageDropdown";
import Dropdown2 from "./Dropdown2";


function readFromLocalStorage(group: string, key: string): string[] {
    const itemGroupString = localStorage.getItem(group);
    if (itemGroupString) {
        const itemGroup = JSON.parse(itemGroupString);
        return itemGroup[key] ?? [];
    }
    return [];
}


function valueIsValid(addValue: string, excludedFromStorage?: { values: string[]; compareOptions?: CompareOptions[] }): boolean {
    if (!addValue || addValue.trim().length == 0) return false;

    if (excludedFromStorage && inStringList(addValue, excludedFromStorage.values, excludedFromStorage.compareOptions)) return false;
    return true;
}

function extendLocalStorage(group: string, key: string, addValue: string): string[] {

    const itemGroupString = localStorage.getItem(group);
    let itemGroup = {};
    if (itemGroupString) {
        itemGroup = JSON.parse(itemGroupString);
    }
    if (!itemGroup[key]) itemGroup[key] = [];
    if (!Array.isArray(itemGroup[key])) throw new Error("LocalStorageDropdown - extendLocalStorage - itemGroup[key] is not an array");

    if (itemGroup[key].includes(addValue)) return itemGroup[key]; //already in list
    itemGroup[key].push(addValue);
    localStorage.setItem(group, JSON.stringify(itemGroup));
    return itemGroup[key]
}

function removeFromLocalStorage(group: string, key: string, rValue: string): string[] {
    const itemGroupString = localStorage.getItem(group);
    let itemGroup = {};
    if (itemGroupString) itemGroup = JSON.parse(itemGroupString);
    else return [];
    if (!itemGroup[key]) return [];
    if (!Array.isArray(itemGroup[key])) throw new Error("LocalStorageDropdown - removeFromLocalStorage - itemGroup[key] is not an array");
    if (!itemGroup[key].includes(rValue)) return itemGroup[key]; //not in list
    itemGroup[key] = itemGroup[key].filter(x => x != rValue);
    localStorage.setItem(group, JSON.stringify(itemGroup));
    return itemGroup[key];
}

export const LocalStorageDropdown = forwardRef((_props: LocalStorageDropdownProps, ref) => {


    const [props] = useDefaults<LocalStorageDropdownProps>(_props, LOCAL_STORAGE_DROPDOWN_DEFAULTS);
    const [propRef] = useDefaultsByRef<LocalStorageDropdownProps>(_props, LOCAL_STORAGE_DROPDOWN_DEFAULTS); // for unmounting
    const [options, setOptions] = useState<string[]>(); // initially built with useLocalStorage however as state setters don't work during unmount changed to a common state
    const [inputText, setInputText] = useState(props.buttonName ?? ''); // holds the current option independent of input field or dropdown so it can be collected if necessary
    const inputTextRef = useRef<string>(); //ref is used to access data from a pointer which in turn can be access in the unmounting

    const onOptionSelected = useCallback((option: string) => {
        setInputText(option); // ensure it's always set
        if (props.onOptionSelected) props.onOptionSelected(option);
    }, [props.onOptionSelected]);

    const onClickDelete = useCallback((option: string) => {
        setOptions(removeFromLocalStorage(props.storageGroupKey, props.storageKey, option));
    }, [props.storageGroupKey, props.storageKey]);


    useImperativeHandle(ref, () => ({
        persistValue() {
            if (valueIsValid(inputTextRef.current, propRef.current.excludedFromStorage)) {
                setOptions(extendLocalStorage(propRef.current.storageGroupKey, propRef.current.storageKey, inputTextRef.current));
            }
        }
    }), []);

    useEffect(() => { inputTextRef.current = inputText }, [inputText]);

    useEffect(() => {
        setOptions(readFromLocalStorage(props.storageGroupKey, props.storageKey));
    }, [props.storageGroupKey, props.storageKey])


    useEffect(() => {
        // return in useEffect is run on unmount (when the component is destroyed or with a change array "before" the values change)
        // since this can't collect data from outdated references & can't use the change array since this would then run on every change & setter aren't available anymore
        // we need to use a ref to access the data
        return () => {
            if (valueIsValid(inputTextRef.current, propRef.current.excludedFromStorage)) {
                extendLocalStorage(propRef.current.storageGroupKey, propRef.current.storageKey, inputTextRef.current);
            }
        }
    }, [])

    if (!options) return; // wait for options to be loaded

    return <>
        {options.length > 0 ?
            <Dropdown2
                buttonName={props.buttonName ?? 'Select'}
                searchDefaultValue={props.searchDefaultValue}
                options={options}
                hasSearchBar={true}
                selectedOption={onOptionSelected}
                onClickDelete={onClickDelete}
                searchTextTyped={(inputText) => {
                    setInputText(inputText)
                    onOptionSelected(inputText)
                }}

            /> :

            <input value={inputText} onChange={(e) => {
                onOptionSelected(e.target.value);
            }}
                className="h-9 w-full text-sm border-gray-300 rounded-md placeholder-italic border text-gray-900 pl-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100"
                placeholder="Enter value..."
                onFocus={(event) => event.target.select()} />
        }


    </>
});