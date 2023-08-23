import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils';

import { InlineErrorDisplay } from '../shared';
import { ConfirmationModalIcon } from '../icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  closeable: boolean;
  isConfirming: boolean;
  confirmSuccessful: boolean;
  isError: boolean;
  error: string;
  image: string | undefined;
  transferDetails: {
    payCurrency: string;
    payAmount: string;
    receiveCurrency: string;
    receiveAmount: string;
  };
}

function BuyConfirmationModal({
  isOpen,
  onClose,
  closeable,
  isConfirming,
  confirmSuccessful,
  isError,
  error,
  transferDetails,
  image,
}: Props) {
  const { payAmount, payCurrency, receiveAmount, receiveCurrency } =
    transferDetails;

  const confirmReceipt = () => {
    // TODO(Denis): add functionality for confirmation
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => null}>
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
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-1">
            {closeable && (
              <button onClick={onClose} className="relative w-full">
                <XCircleIcon className="absolute right-0 mr-4 h-7 w-7" />
              </button>
            )}

            <div className="p-8">
              <div className="flex items-center justify-center">
                {image ? (
                  <Image
                    src={image}
                    width={200}
                    height={200}
                    alt="image preview"
                    className="object-contain"
                  />
                ) : (
                  <ConfirmationModalIcon
                    className="text-white"
                    ellipseFill={confirmSuccessful ? '#67C96C' : '#FD8B4B'}
                  />
                )}
              </div>

              <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
                {confirmSuccessful
                  ? 'You have recieved the crypto successfully!'
                  : 'Waiting For Confirmation'}
              </Dialog.Title>
              {confirmSuccessful ? (
                <Dialog.Description
                  className={classNames(
                    isConfirming ? 'animate-pulse' : '',
                    'mt-2 text-center text-sm text-sleep-100'
                  )}
                >
                  Waiting for escrow to release crypto.
                </Dialog.Description>
              ) : (
                <Dialog.Description
                  className={classNames(
                    isConfirming ? 'animate-pulse' : '',
                    'mt-2 text-center text-sm text-sleep-100'
                  )}
                >
                  Paying {payAmount} {payCurrency} for {receiveAmount}{' '}
                  {receiveCurrency}
                </Dialog.Description>
              )}

              {confirmSuccessful && (
                <button
                  type="submit"
                  className="mt-8 w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                  onClick={confirmReceipt}
                >
                  Confirm receipt
                </button>
              )}

              {(confirmSuccessful || isError) && (
                <button className="mt-2 w-full text-sm text-sleep-100">
                  Dispute transaction
                </button>
              )}

              <InlineErrorDisplay show={isError} error={error} />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default BuyConfirmationModal;
