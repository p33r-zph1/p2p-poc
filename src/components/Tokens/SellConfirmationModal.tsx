import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils';

import { InlineErrorDisplay } from '../shared';
import { ConfirmationModalIcon } from '../icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  closeable: boolean;
  isTransfering: boolean;
  isError: boolean;
  error: string;
  transferSuccessful: boolean;
  transferDetails: {
    payCurrency: string;
    payAmount: string;
    receiveCurrency: string | undefined;
    receiveAmount: string | undefined;
  };
  confirmReceipt: () => void;
  disputeTransaction: () => void;
  isConfirmingOrDisputing: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  closeable,
  isTransfering,
  error,
  isError,
  transferDetails,
  transferSuccessful,
  confirmReceipt,
  disputeTransaction,
  isConfirmingOrDisputing,
}: Props) {
  const { payAmount, payCurrency, receiveAmount, receiveCurrency } =
    transferDetails;

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
                <ConfirmationModalIcon
                  className="text-white"
                  ellipseFill={transferSuccessful ? '#67C96C' : '#FD8B4B'}
                />
              </div>
              <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
                {transferSuccessful
                  ? "Crypto successfully sent to P33R's secure escrow account"
                  : 'Waiting For Confirmation'}
              </Dialog.Title>
              {transferSuccessful ? (
                <Dialog.Description
                  className={classNames(
                    isTransfering ? 'animate-pulse' : '',
                    'mt-2 text-center text-sm text-sleep-100'
                  )}
                >
                  Please confirm receipt of FIAT payment {receiveAmount || '-'}{' '}
                  {receiveCurrency || '-'} within the next 10 minutes, otherwise
                  this transaction will be cancelled and your crypto payment
                  will be refunded to your wallet.
                </Dialog.Description>
              ) : (
                <Dialog.Description
                  className={classNames(
                    isTransfering ? 'animate-pulse' : '',
                    'mt-2 text-center text-sm text-sleep-100'
                  )}
                >
                  Paying {payAmount} {payCurrency}{' '}
                  {Boolean(receiveAmount) &&
                    Boolean(receiveCurrency) &&
                    `for ${receiveAmount} ${receiveCurrency}`}
                  <br /> Confirm this transaction in your wallet
                </Dialog.Description>
              )}
              {isConfirmingOrDisputing ? (
                <Dialog.Description
                  className={
                    'mt-2 animate-pulse text-center text-sm text-sleep-100'
                  }
                >
                  Please wait...
                </Dialog.Description>
              ) : (
                <>
                  {transferSuccessful && (
                    <>
                      <div className="mt-4 text-center text-sm font-bold text-red-500">
                        Warning: Please do not close or refresh the browser
                        doing so might lead to loss of funds. Make sure you have
                        received the funds before clicking the &quot;I have
                        received the payment&quot; button.
                      </div>

                      <button
                        type="submit"
                        className="mt-8 w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                        onClick={confirmReceipt}
                      >
                        I have received the payment
                      </button>
                    </>
                  )}

                  {(transferSuccessful || isError) && (
                    <button
                      className="mt-2 w-full text-sm text-sleep-100"
                      onClick={disputeTransaction}
                    >
                      Dispute transaction
                    </button>
                  )}
                </>
              )}
              <InlineErrorDisplay show={isError} error={error} />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ConfirmationModal;
