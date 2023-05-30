import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Tooltip } from '@nextui-org/react'
import Image from 'next/image';
import { combineClassNames } from '../../javascript-functions/general';
import { LayoutDropdownProps } from '../types/dropdown';

export default function LayoutDropdown(props: LayoutDropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button>
                    <Tooltip color="invert" content="Kern AI" placement="right">
                        <div
                            className='cursor-pointer group flex items-center p-2 text-sm font-medium rounded-md border border-gray-200 hover:bg-gray-50'
                        >
                            <Image src="/workflow/kern-icon.png" width="32" height="32" />
                        </div>
                    </Tooltip>
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
                <Menu.Items className="fixed bottom-[74px] left-20 z-50 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {props.visibility[0] ? (
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/welcome"
                                        rel="noopener noreferrer"
                                        className={combineClassNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'group flex items-center px-4 py-2 text-sm cursor-pointer font-mono'
                                        )}
                                    >
                                        <Image src="/workflow/kern-icon.png" width="21" height="21" />
                                        <span className='ml-2'>cockpit</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}

                        {props.visibility[1] ? (
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/refinery/projects"
                                        rel="noopener noreferrer"
                                        className={combineClassNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'group flex items-center px-4 py-2 text-sm cursor-pointer font-mono'
                                        )}
                                    >
                                        <Image src="/workflow/refinery-icon.png" width="21" height="21" />
                                        <span className='ml-2'>refinery</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}


                        {props.visibility[2] ? (
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/gates"
                                        rel="noopener noreferrer"
                                        className={combineClassNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'group flex items-center px-4 py-2 text-sm cursor-pointer font-mono'
                                        )}
                                    >
                                        <Image src="/workflow/gates-icon.png" width="21" height="21" />
                                        <span className='ml-2'>gates</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}

                        {props.visibility[3] ? (
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/workflow/workflows"
                                        rel="noopener noreferrer"
                                        className={combineClassNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'group flex items-center px-4 py-2 text-sm cursor-pointer font-mono'
                                        )}
                                    >
                                        <Image
                                            src="/gates/workflow-icon.png"
                                            width={21}
                                            height={21}
                                            alt="workflow"
                                        />
                                        <span className='ml-2'>workflow</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}