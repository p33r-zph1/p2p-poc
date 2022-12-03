import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';

import transactionDoneImg from '@/images/transaction-done.png';
import { ITransaction } from '@/hooks/useTransactions';

interface Props {
  isOpen: boolean;
  close(): void;
  transaction: ITransaction;
}

function SuccessfulTransactionModal({ close, isOpen, transaction }: Props) {
  const { details } = transaction;

  const createNewTransaction = () => {
    // TODO(Denis): add functionality for this
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
              <Image src={transactionDoneImg} alt="transaction done" />
            </div>
            <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
              Congratulations!
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-center text-sm text-sleep-100">
              You have just {details.type === 'buy' ? 'bought' : 'sold'}{' '}
              {details.payment.amount} {details.payment.currency} for 2{' '}
              {details.order.currency}
              {/* TODO(Karim, Dennis): Update this to reflect tx once api updates for $60,876 USD */}
            </Dialog.Description>

            <button
              type="submit"
              className="mt-8 w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
              onClick={createNewTransaction}
            >
              Make another transaction
            </button>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default SuccessfulTransactionModal;
