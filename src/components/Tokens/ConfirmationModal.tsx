import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { classNames } from '@/utils';
import { InlineErrorDisplay } from '../shared';
import { ConfirmationModalIcon } from '../icons';

interface Props {
  isOpen: boolean;
  close(): void;
  transfering: boolean;
  showError: boolean;
  error: string;
}

function ConfirmationModal({
  close,
  isOpen,
  transfering,
  error,
  showError,
}: Props) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-10">
            <div className="flex items-center justify-center">
              <ConfirmationModalIcon className="text-white" />
            </div>

            <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
              Waiting For Confirmation
            </Dialog.Title>
            <Dialog.Description
              className={classNames(
                transfering ? 'animate-pulse' : '',
                'mt-2 text-center text-sm text-sleep-100'
              )}
            >
              Paying 50 ETH for $60,876 USD <br /> Confirm this transaction in
              your wallet
            </Dialog.Description>

            <InlineErrorDisplay show={showError} error={error} />
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ConfirmationModal;
