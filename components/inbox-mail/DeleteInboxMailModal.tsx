import { Dialog, Transition } from "@headlessui/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Fragment, useMemo, useRef } from "react";

interface ConfirmDeleteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
    translator: any;
}


export default function DeleteInboxMailModal(props: ConfirmDeleteModalProps) {

    const cancelRef = useRef(null);
    const t = useMemo(() => props.translator, [props.translator]);

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelRef} onClose={props.setOpen ? props.setOpen : () => null}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full justify-center p-4 items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="flex justify-center w-full">
                                <div className="w-full max-w-md">
                                    <Dialog.Panel className="relative rounded-lg bg-white shadow-xl sm:my-8">
                                        <div className="p-6">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center 
                                                                    rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <IconAlertTriangle className="h-6 w-6 text-red-600" />
                                                </div>

                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-lg font-medium leading-6 text-gray-900"
                                                    >
                                                        {t("inboxMail.deleteHeader")}
                                                    </Dialog.Title>

                                                    <p className="mt-2 text-sm text-gray-600">{t("inboxMail.deleteConfirmation")}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
                                                <button
                                                    onClick={() => {
                                                        props.onConfirm();
                                                        props.setOpen(false);
                                                    }}
                                                    className="inline-flex w-full justify-center rounded-md border border-transparent 
                                                                bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm 
                                                                hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    {t("inboxMail.deleteButton")}
                                                </button>
                                                <button
                                                    ref={cancelRef}
                                                    onClick={() => props.setOpen(false)}
                                                    className="inline-flex w-full justify-center rounded-md border border-gray-300 
                                                                bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm 
                                                                hover:bg-gray-50 sm:w-auto sm:text-sm"
                                                >
                                                    {t("inboxMail.cancelButton")}
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}