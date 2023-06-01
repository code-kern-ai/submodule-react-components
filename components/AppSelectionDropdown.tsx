import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Tooltip } from '@nextui-org/react'
import Image from 'next/image';
import { combineClassNames } from '../../javascript-functions/general';
import { AppSelectionDropdownProps } from '../types/dropdown';
import kernLogo from '../assets/kern-icon.png';
import refineryLogo from '../assets/refinery-icon.png';
import gatesLogo from '../assets/gates-icon.png';
import workflowLogo from '../assets/workflow-icon.png';

export default function PlatformWelcomeDropdown(props: AppSelectionDropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button>
                    <Tooltip color="invert" content="Kern AI" placement="right">
                        <div
                            className={`cursor-pointer group flex items-center p-2 text-sm font-medium rounded-md border ${props.workflow ? 'border-gray-800 hover:bg-neutral-800' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Image src={kernLogo} width="32" height="32" alt='Kern' />
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
                <Menu.Items className="fixed z-50 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style={{ bottom: '74px', left: '80px' }}>
                    <div className="py-1">
                        {props.cockpit ? (
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
                                        <Image src={kernLogo} width="21" height="21" alt='cockpit' />
                                        <span className='ml-2'>cockpit</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}

                        {props.refinery ? (
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
                                        <Image src={refineryLogo} width="21" height="21" alt='refinery' />
                                        <span className='ml-2'>refinery</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}


                        {props.gates ? (
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
                                        <Image src={gatesLogo} width="21" height="21" alt='gates' />
                                        <span className='ml-2'>gates</span>
                                    </a>
                                )}
                            </Menu.Item>
                        ) : null}

                        {props.workflow ? (
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
                                            src={workflowLogo}
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