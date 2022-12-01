import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { PaymentDetails } from '@/pages';

interface Props {
  isOpen: boolean;
  close(): void;
  onSuccess(): void;
  paymentDetails?: PaymentDetails;
  walletAddress?: string;
}

function ZPKycModal({
  close,
  isOpen,
  onSuccess,
  walletAddress,
  paymentDetails,
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
          <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-10">
            <Dialog.Title className="text-center">ZPKyc</Dialog.Title>
            <Dialog.Description className="text-center">
              Validating your wallet address...
            </Dialog.Description>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ZPKycModal;
