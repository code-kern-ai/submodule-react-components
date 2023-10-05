import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DropdownProps } from '../types/dropdown';
import { combineClassNames } from '../../javascript-functions/general';
import { getTextArray } from '../helpers/dropdown-helper';
import { Tooltip } from '@nextui-org/react';

export default function Dropdown(props: DropdownProps) {
    const isDisabled = props.disabled || props.options.length < 1;

    const [dropdownCaptions, setDropdownCaptions] = useState<any[]>([]);
    const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (props.doNotUseTextArray) {
            setDropdownCaptions(props.options ?? []);
        } else if (props.hasSearchBar) {
            const filtered = props.options.filter(option =>
                option.toLowerCase().includes(searchText.toLowerCase())
            );
            setDropdownCaptions(filtered);
        }
        else {
            setDropdownCaptions(getTextArray(props.options));
        }
    }, [props.options, searchText]);

    useEffect(() => {
        if (props.disabledOptions) {
            setDisabledOptions(props.disabledOptions);
        } else {
            setDisabledOptions(Array(props.options.length).fill(false));
        }
    }, [props.disabledOptions]);

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

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function handleClickOutside(e: any) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    }

    return (
        <Menu ref={dropdownRef} as="div" className={`relative inline-block text-left ${props.dropdownWidth ? props.dropdownWidth : 'w-full'} ${props.dropdownClasses ? props.dropdownClasses : ''}`}>
            <div>
                {props.hasSearchBar ? <div className="w-full" onClick={toggleDropdown}>
                    <input value={searchText} onChange={(e) => {
                        setSearchText(e.target.value);
                        setIsOpen(true);
                    }}
                        className="h-9 w-full border-gray-300 rounded-md placeholder-italic border text-gray-900 pl-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100" placeholder="Type to search..." />
                    <ChevronDownIcon
                        className="h-5 w-5 absolute right-0 mr-3 -mt-7"
                        aria-hidden="true"
                    />
                </div> : <Menu.Button onClick={toggleDropdown} className={`inline-flex w-full justify-between items-center rounded-md border border-gray-300
            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100
            ${isDisabled ? "opacity-50" : ""} ${props.buttonClasses ? props.buttonClasses : ''}`}
                    disabled={isDisabled}
                >
                    {props.buttonName}
                    <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                    />
                </Menu.Button>}
            </div>
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
                <Menu.Items className={`absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none ${props.dropdownItemsWidth ? props.dropdownItemsWidth : 'w-full'} ${props.dropdownItemsClasses ? props.dropdownItemsClasses : ''}`}>
                    <div className="py-1">
                        {dropdownCaptions.map((option: any, index: number) => (
                            <div key={option + '-' + index}>
                                <Menu.Item disabled={disabledOptions[index]}>
                                    {({ active }) => (
                                        <a key={option.id}
                                            className={combineClassNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                disabledOptions[index] ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer",
                                                "block px-4 py-2 text-sm"
                                            )}
                                            onClick={() => {
                                                if (props.selectedOption) {
                                                    props.selectedOption(option);
                                                    if (props.hasSearchBar) {
                                                        setSearchText(option);
                                                    }
                                                    setIsOpen(false);
                                                }
                                            }}
                                        >
                                            <Tooltip content={props.tooltipsArray && props.tooltipsArray[index]} placement={props.tooltipArrayPlacement ? props.tooltipArrayPlacement : 'left'} color="invert">
                                                {props.doNotUseTextArray ? option.name : option}
                                            </Tooltip>
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
