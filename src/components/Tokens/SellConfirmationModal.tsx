import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { classNames } from '@/utils';

import { InlineErrorDisplay } from '../shared';
import { ConfirmationModalIcon } from '../icons';

interface Props {
  isOpen: boolean;
  close: () => void;
  isTransfering: boolean;
  isError: boolean;
  error: string;
  transferSuccessful: boolean;
  transferDetails: {
    payCurrency: string;
    payAmount: string;
    receiveCurrency: string;
    receiveAmount: string;
  };
}

function ConfirmationModal({
  isOpen,
  close,
  isTransfering,
  error,
  isError,
  transferDetails,
  transferSuccessful,
}: Props) {
  const { payAmount, payCurrency, receiveAmount, receiveCurrency } =
    transferDetails;

  const confirmReceipt = () => {
    // TODO(Denis): add functionality for confirmation
    setTimeout(() => {
      close();
    }, 1000);
  };

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
              <ConfirmationModalIcon
                className="text-white"
                ellipseFill={transferSuccessful ? '#67C96C' : '#FD8B4B'}
              />
            </div>

            <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
              {transferSuccessful
                ? "Crypto successfully sent to P33R's secure escrow account!"
                : 'Waiting For Confirmation'}
            </Dialog.Title>
            {transferSuccessful ? (
              <Dialog.Description
                className={classNames(
                  isTransfering ? 'animate-pulse' : '',
                  'mt-2 text-center text-sm text-sleep-100'
                )}
              >
                Please confirm receipt of FIAT payment {receiveAmount}{' '}
                {receiveCurrency} within the next 10 minutes, otherwise this
                transaction will be cancelled and your crypto payment will be
                refunded to your wallet.
              </Dialog.Description>
            ) : (
              <Dialog.Description
                className={classNames(
                  isTransfering ? 'animate-pulse' : '',
                  'mt-2 text-center text-sm text-sleep-100'
                )}
              >
                Paying {payAmount} {payCurrency} for {receiveAmount}{' '}
                {receiveCurrency}
                <br /> Confirm this transaction in your wallet
              </Dialog.Description>
            )}

            {transferSuccessful && (
              <button
                type="submit"
                className="mt-8 w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                onClick={confirmReceipt}
              >
                Confirm receipt
              </button>
            )}

            <InlineErrorDisplay show={isError} error={error} />
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ConfirmationModal;
