import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DropdownProps, OptionProps } from '../types/dropdown';
import { combineClassNames } from '../../javascript-functions/general';


export default function Dropdown(props: DropdownProps) {
    const isDisabled = props.disabled || props.options.length < 1;
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className={`inline-flex w-full justify-center items-center rounded-md border border-gray-300
            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-100
            ${isDisabled ? "opacity-50" : ""}`}
                    disabled={isDisabled}
                >
                    {props.buttonName}
                    <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {props.options.map((option: OptionProps) => (
                            <div key={option.id}>
                                <Menu.Item >
                                    {({ active }) => (
                                        <a key={option.id}
                                            className={combineClassNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block px-4 py-2 text-sm cursor-pointer"
                                            )}
                                            onClick={() => {
                                                props.selectedOption(option);
                                            }}
                                        >
                                            {option.name}
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
