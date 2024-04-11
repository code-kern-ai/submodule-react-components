import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DropdownProps } from '../types/dropdown';
import { combineClassNames } from '../../javascript-functions/general';
import { SELECT_ALL, checkDropdownProps, getActiveNegateGroupColor, getDropdownDisplayText, prepareDropdownOptionsToArray, reduceColorProperty, setOptionsWithSearchBar } from '../helpers/dropdown-helper';
import { Tooltip } from '@nextui-org/react';
import { IconChevronDown, IconDotsVertical, IconExternalLink, IconLoader } from '@tabler/icons-react';
import { IconTrashXFilled } from '@tabler/icons-react';
import useOnClickOutside from '../hooks/useHooks/useOnClickOutside';
import * as TablerIcons from '@tabler/icons-react';
import { useDefaults } from '../hooks/useDefaults';

const DEFAULTS = { fontSizeClass: 'text-xs' };

export default function Dropdown2(props: DropdownProps) {
    const isDisabled = props.disabled || props.options.length == 0;

    const [dropdownCaptions, setDropdownCaptions] = useState<any[]>([]);
    const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);
    const [backgroundColors, setBackgroundColors] = useState<string[]>([]);
    const [searchText, setSearchText] = useState(props.searchDefaultValue ?? '');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<any[]>([]);
    const [position, setPosition] = useState(null);
    const [savedIndex, setSavedIndex] = useState(null);

    const [defaultProps] = useDefaults<{ fontSizeClass: string }>(props, DEFAULTS);

    const dropdownRef = useRef(null);
    useOnClickOutside(dropdownRef, () => setIsOpen(false));

    useEffect(() => {
        checkDropdownProps(props);
    }, [props]);

    useEffect(() => {
        if (!props.onSearchChange) return;
        props.onSearchChange(searchText)
    }, [props.onSearchChange, searchText]);

    useEffect(() => {
        const prepareOptions = prepareDropdownOptionsToArray(props.options, props.hasSearchBar, props.valuePropertyPath);
        if (props.hasSearchBar) {
            setDropdownCaptions(setOptionsWithSearchBar(prepareOptions, searchText));
        } else if (props.hasCheckboxes) {
            setOptionsWithCheckboxes(prepareOptions);
        } else {
            setDropdownCaptions(prepareOptions);
        }
    }, [props.options, searchText, selectedCheckboxes, props.hasSearchBar, props.hasCheckboxes, props.selectedCheckboxes, props.hasSelectAll, props.valuePropertyPath]);

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
        if (isOpen && props.keepDrownOpen) return;
        setIsOpen(!isOpen);
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

    function handleSelectedCheckboxesThreeStates(index: number) {
        const optionSave = { ...props.options[index] };
        if (!optionSave['active'])
            optionSave['active'] = true;
        else if (optionSave['active'] && !optionSave['negate'])
            optionSave['negate'] = true;
        else {
            optionSave['negate'] = false;
            optionSave['active'] = false;
        }
        props.selectedOption(optionSave);
    }

    function setHoverBoxPosition(e, index?: number) {
        if (!e) {
            setPosition(null);
            return;
        }
        const dataBoundingBox: DOMRect = e.target.getBoundingClientRect();
        setPosition({ top: dataBoundingBox.height * index, left: dataBoundingBox.width });
        setSavedIndex(index);
    }


    function performActionOnClick(option: string, index: number) {
        if (props.hasCheckboxes) {
            handleSelectedCheckboxes(option, index, { target: { checked: !selectedCheckboxes[index].checked } });
            return;
        }
        if (props.hasCheckboxesThreeStates) {
            handleSelectedCheckboxesThreeStates(index)
            return;
        }
        if (props.selectedOption) {
            props.selectedOption(props.options[index]);
            if (props.hoverBoxList) setHoverBoxPosition(null);
            if (props.hasSearchBar) {
                setSearchText(option);
            }
            setIsOpen(false);
        }
    }

    return (
        <Menu ref={dropdownRef} as="div" className={`relative inline-block text-left ${props.dropdownWidth ?? 'w-full'} ${props.dropdownClasses ?? ''} ${props.fontClass ?? ''}`}>
            <div>
                {props.hasSearchBar ? <div className="w-full" onClick={toggleDropdown}>
                    <input value={searchText} onChange={(e) => {
                        setSearchText(e.target.value);
                        if (props.searchTextTyped) props.searchTextTyped(e.target.value);
                        if (props.filteredOptions) props.filteredOptions(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                        onFocus={(event) => event.target.select()}
                        className="h-9 w-full text-sm border-gray-300 rounded-md placeholder-italic border text-gray-900 pr-8 pl-4 truncate placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isDisabled && !props.ignoreDisabledForSearch}
                        placeholder="Type to search..." />
                    <IconChevronDown
                        className={`h-5 w-5 absolute right-0 mr-3 -mt-7 ${isDisabled && !props.ignoreDisabledForSearch ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                    ) : (<Menu.Button onClick={toggleDropdown} className={`inline-flex w-full justify-between items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm  focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${props.buttonClasses ?? ''} ${props.buttonCaptionBgColor ?? 'bg-white hover:bg-gray-50'}`}
                        disabled={isDisabled && !props.hasCheckboxes}>
                        {!props.hasCheckboxesThreeStates && props.buttonName}
                        {props.hasCheckboxesThreeStates && <label
                            className="truncate cursor-pointer text-sm">{getDropdownDisplayText(props.options, "EMPTY")}
                            <span style={{ color: '#2563eb' }}>{getDropdownDisplayText(props.options, "NOT_NEGATED")}</span>
                            <span style={{ color: '#ef4444' }}>{getDropdownDisplayText(props.options, "NEGATED")}</span>
                        </label>}
                        <IconChevronDown
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
                            <div key={option + "-" + index} className='relative'>
                                <Menu.Item disabled={disabledOptions[index]}>
                                    {({ active }) => (
                                        <div className='w-full'>
                                            <Tooltip content={props.tooltipsArray && props.tooltipsArray[index]} placement={props.tooltipArrayPlacement ?? 'left'} color="invert" style={{ width: '100%' }} className={disabledOptions[index] ? 'pointer-events-none' : ''}>
                                                <label htmlFor="option"
                                                    className={combineClassNames(
                                                        disabledOptions[index] ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer",
                                                        backgroundColors[index], props.useDifferentTextColor && props.useDifferentTextColor[index] ? 'text-' + props.differentTextColor + '-700' : active && !backgroundColors[index] ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                        props.iconsArray && props.iconsArray[index] ? "px-2" : "px-4",
                                                        defaultProps.fontSizeClass,
                                                        "py-2 flex items-center"
                                                    )}
                                                    onClick={() => {
                                                        performActionOnClick(option, index);
                                                    }} onMouseEnter={(e) => {
                                                        if (!props.optionsHaveHoverBox) return;
                                                        setHoverBoxPosition(e, index);

                                                    }} onMouseLeave={() => {
                                                        if (!props.optionsHaveHoverBox) return;
                                                        setHoverBoxPosition(null);
                                                    }}>
                                                    {props.hasCheckboxes && <input checked={selectedCheckboxes[index].checked} name="option" type="checkbox" className="mr-3 cursor-pointer"
                                                        onChange={(e) => handleSelectedCheckboxes(option, index, e)} />}
                                                    {props.hasCheckboxesThreeStates && <div className="h-4 w-4 border-gray-300 mr-3 border rounded hover:bg-gray-200 min-w-4"
                                                        style={{ backgroundColor: getActiveNegateGroupColor(props.options[index]), borderColor: getActiveNegateGroupColor(props.options[index]) }}>
                                                    </div>}
                                                    {props.iconsArray && props.iconsArray[index] && <span className='mx-2 text-gray-700'>
                                                        <SVGIcon icon={props.iconsArray[index]} size={16} strokeWidth={2} useFillForIcons={props.useFillForIcons && props.useFillForIcons[index]} /></span>}
                                                    <span className='truncate'>{option}</span>
                                                    {props.onClickDelete && <div className="ml-auto flex items-center cursor-pointer hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); props.onClickDelete(option) }}><IconTrashXFilled size={20} /></div>}
                                                    {props.optionsHaveLink && <a href={props.linkList[index]} target="_blank" className="h-4 w-4 mr-2 ml-auto flex items-center cursor-pointer"><IconExternalLink size={16} /></a>}
                                                </label>
                                                {index == props.lineSeparatorIndex && <hr className="my-2 border-t border-dashed h-px border-gray-700" onMouseEnter={() => setHoverBoxPosition(null)}></hr>}
                                            </Tooltip>
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                        ))}
                    </div>
                </Menu.Items>
            </Transition >
            <HoverBox position={position} hoverBox={props.hoverBoxList && props.hoverBoxList[savedIndex]} />
        </Menu >
    );
}

function HoverBox(props: { position: any, hoverBox: any }) {
    return (<>
        {props.position && <div className={`absolute top-0 w-fit h-fit rounded-2xl card shadow bg-white z-10 ${props.position ? 'block' : 'hidden'}`}
            style={{ top: props.position.top, left: props.position.left }}>
            <div className="card-body p-6 flex flex-col w-64">
                <div className="flex justify-center">
                    <span className="card-title mb-2 label-text">Info</span>
                </div>
                <div className="grid grid-cols-2  gap-2 items-center" style={{ gridTemplateColumns: 'max-content auto' }}>
                    {props.hoverBox.avgTime && <Fragment>
                        <span className="label-text text-sm font-bold">Avg Time</span>
                        <span className="label-text text-sm">{props.hoverBox.avgTime}</span></Fragment>}
                    {props.hoverBox.base && <Fragment>
                        <span className="label-text text-sm font-bold">Based on</span>
                        <span className="label-text text-sm">{props.hoverBox.base}</span>
                    </Fragment>}
                    {props.hoverBox.size && <Fragment>
                        <span className="label-text text-sm font-bold">Size</span>
                        <span className="label-text text-sm">{props.hoverBox.size}</span>
                    </Fragment>}
                </div>
                {!props.hoverBox.avgTime && !props.hoverBox.base && !props.hoverBox.size && <Fragment>
                    <span className="label-text text-sm">{props.hoverBox}</span>
                </Fragment>}
            </div>
        </div>}
    </>)
}

function SVGIcon({ icon, size, strokeWidth, useFillForIcons }) {
    const Icon = TablerIcons[icon];
    if (Icon) {
        return (
            <Icon
                size={size}
                strokeWidth={strokeWidth}
                className={`${useFillForIcons ? 'fill-gray-800' : ''}`}
            />
        )
    } else {
        return <IconLoader size={size} strokeWidth={strokeWidth} />
    }
}