import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DropdownProps } from '../types/dropdown';
import { combineClassNames } from '../../javascript-functions/general';
import { SELECT_ALL, checkDropdownProps, prepareDropdownOptionsToArray, reduceColorProperty, setOptionsWithSearchBar } from '../helpers/dropdown-helper';
import { Tooltip } from '@nextui-org/react';
import { IconDotsVertical } from '@tabler/icons-react';

export default function Dropdown(props: DropdownProps) {
    const isDisabled = props.disabled || props.options.length == 0;

    const [dropdownCaptions, setDropdownCaptions] = useState<any[]>([]);
    const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);
    const [backgroundColors, setBackgroundColors] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<any[]>([]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        checkDropdownProps(props);
    }, [props]);

    useEffect(() => {
        const prepareOptions = prepareDropdownOptionsToArray(props.options, props.doNotUseTextArray);
        if (props.hasSearchBar) {
            setDropdownCaptions(setOptionsWithSearchBar(prepareOptions, searchText));
        } else if (props.hasCheckboxes) {
            setOptionsWithCheckboxes(prepareOptions);
        } else {
            setDropdownCaptions(prepareOptions);
        }
    }, [props.options, searchText, selectedCheckboxes, props.doNotUseTextArray, props.hasSearchBar, props.hasCheckboxes, props.selectedCheckboxes, props.hasSelectAll]);

    useEffect(() => {
        if (!props.disabledOptions || !props.options) return;
        if (props.disabledOptions) {
            setDisabledOptions(props.disabledOptions);
        } else {
            setDisabledOptions(Array(props.options.length).fill(false));
        }
    }, [props.disabledOptions]);

    useEffect(() => {
        if (!props.backgroundColors) return;
        setBackgroundColors(props.backgroundColors.map((x) => "bg-" + reduceColorProperty(x, '100')));
    }, [props.backgroundColors]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    function setOptionsWithCheckboxes(options: any[]) {
        if (selectedCheckboxes.length > 0) return;
        const newSelectedCheckboxes = options.map((option: any, index: number) => {
            return {
                name: option,
                checked: props.selectedCheckboxes ? props.selectedCheckboxes[index] : false
            }
        });
        if (props.hasSelectAll) {
            newSelectedCheckboxes.push({
                name: SELECT_ALL,
                checked: false
            });
        }
        setSelectedCheckboxes(newSelectedCheckboxes);
        setDropdownCaptions(newSelectedCheckboxes.map((option: any) => option.name));
    }

    function toggleDropdown() {
        if (isDisabled && !props.hasCheckboxes) return; // if the dropdown has checkboxes, it shouldn't be disabled because the user can still select options
        setIsOpen(!isOpen);
    }

    function handleClickOutside(e: any) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    }

    function handleSelectedCheckboxes(option: string, index: number, e: any) {
        let newSelectedCheckboxes = [...selectedCheckboxes];
        if (option == SELECT_ALL) {
            newSelectedCheckboxes.forEach((checkbox) => {
                checkbox.checked = e.target.checked;
            });
        } else {
            const lastIdx = newSelectedCheckboxes.length - 1;
            if (props.hasSelectAll && newSelectedCheckboxes[lastIdx].checked) {
                newSelectedCheckboxes[lastIdx].checked = false;
            }
            newSelectedCheckboxes[index].checked = e.target.checked;
        }
        setSelectedCheckboxes(newSelectedCheckboxes);
        if (props.hasSelectAll) {
            newSelectedCheckboxes = newSelectedCheckboxes.filter((checkbox) => checkbox.name != SELECT_ALL);
        }
        props.selectedOption(newSelectedCheckboxes);
    }

    return (
        <Menu ref={dropdownRef} as="div" className={`relative inline-block text-left ${props.dropdownWidth ?? 'w-full'} ${props.dropdownClasses ?? ''}`}>
            <div>
                {props.hasSearchBar ? <div className="w-full" onClick={toggleDropdown}>
                    <input value={searchText} onChange={(e) => {
                        setSearchText(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                        className="h-9 w-full text-sm border-gray-300 rounded-md placeholder-italic border text-gray-900 pl-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100" placeholder="Type to search..." />
                    <ChevronDownIcon
                        className="h-5 w-5 absolute right-0 mr-3 -mt-7"
                        aria-hidden="true"
                    />
                </div> : <>
                    {props.hasButtonDots ? (<Menu.Button onClick={toggleDropdown} className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="flex h-full w-full items-center justify-center rounded-full">
                            <IconDotsVertical
                                size={24}
                                strokeWidth={2}
                                className='text-gray-700 font-bold' />
                        </span>
                    </Menu.Button>
                    ) : (<Menu.Button onClick={toggleDropdown} className={`inline-flex w-full justify-between items-center rounded-md border border-gray-300
            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${props.buttonClasses ?? ''}`}
                        disabled={isDisabled && !props.hasCheckboxes}>
                        {props.buttonName}
                        <ChevronDownIcon
                            className="-mr-1 ml-2 h-5 w-5"
                            aria-hidden="true"
                        />
                    </Menu.Button>)}
                </>}
            </div >
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={isOpen}
            >
                <Menu.Items className={`absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none ${props.dropdownItemsWidth ?? 'w-full'} ${props.dropdownItemsClasses ?? ''}`}>
                    <div className="py-1">
                        {dropdownCaptions.map((option: any, index: number) => (
                            <div key={option}>
                                <Menu.Item disabled={disabledOptions[index]}>
                                    {({ active }) => (
                                        <label key={option.id} htmlFor="option"
                                            className={combineClassNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                disabledOptions[index] ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer",
                                                "px-4 py-2 text-sm flex items-center",
                                                backgroundColors[index]
                                            )}
                                            onClick={() => {
                                                if (props.hasCheckboxes) {
                                                    handleSelectedCheckboxes(option, index, { target: { checked: !selectedCheckboxes[index].checked } });
                                                    return;
                                                }
                                                if (props.selectedOption) {
                                                    props.selectedOption(option);
                                                    if (props.hasSearchBar) {
                                                        setSearchText(option);
                                                    }
                                                    setIsOpen(false);
                                                }
                                            }}>
                                            {props.hasCheckboxes && <input checked={selectedCheckboxes[index].checked} name="option" type="checkbox" className="mr-3"
                                                onChange={(e) => handleSelectedCheckboxes(option, index, e)} />}
                                            <Tooltip content={props.tooltipsArray && props.tooltipsArray[index]} placement={props.tooltipArrayPlacement ?? 'left'} color="invert">
                                                {option}
                                            </Tooltip>
                                        </label>
                                    )}
                                </Menu.Item>
                            </div>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu >
    );
}
