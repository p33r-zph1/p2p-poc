import { classNames } from '@/utils';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { MouseEventHandler } from 'react';

import { type ITransaction } from './Transactions';

interface Props {
  transaction: ITransaction;
  lastItem?: boolean;
}

interface StatusBadgeProps {
  status: ITransaction['status'];
  onConfirmReciept: MouseEventHandler<HTMLButtonElement>;
}

function StatusBadge({ status, onConfirmReciept }: StatusBadgeProps) {
  if (status === 'crypto_escrow_confirm') {
    return (
      <>
        <button
          className="hidden rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300 md:block"
          onClick={onConfirmReciept}
        >
          Please confirm Fiat receipt
        </button>

        <button
          className="rounded-2xl bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300 md:hidden"
          onClick={onConfirmReciept}
        >
          Confirm receipt
        </button>
      </>
    );
  }

  if (status === 'matching') {
    return (
      <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
        <p className="text-sm text-[#4FA355]">Pending</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="rounded-full bg-[#FFF6E6] px-4 py-2 font-bold">
        <p className="text-sm text-[#FFAD0D]">Successful</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="rounded-full bg-[#FAEBEB] px-4 py-2 font-bold">
        <p className="text-sm text-[#D74E47]">Failed</p>
      </div>
    );
  }

  // TODO(karim) getting
  return (
    <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
      <p className="text-sm text-[#4FA355]">Pending</p>
    </div>
  );
}

function Transation({ transaction, lastItem = true }: Props) {
  const { details, status } = transaction;

  const confirmReceipt: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();

    console.log('called');
  };

  return (
    <div className={classNames(lastItem ? '' : 'border-b')}>
      <Disclosure>
        {({ open }) => (
          <div className="p-5">
            <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-brand focus-visible:ring-opacity-75">
              <div className="space-y-2">
                <p className="text-xs font-semibold sm:text-sm md:text-lg">
                  {details.payment.amount} {details.payment.currency}
                </p>
                <p className="flex items-center space-x-2 text-sleep-100">
                  <span>
                    {details.type === 'buy' ? 'Buy crypto' : 'Sell crypto'}
                  </span>
                  <span
                    className="block h-1 w-1 rounded-full bg-sleep-100"
                    aria-hidden
                  />
                  <span>Nov 25, 2022 10:12pm</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <StatusBadge
                  status={status}
                  onConfirmReciept={confirmReceipt}
                />

                <ChevronRightIcon
                  className={classNames(
                    open ? '-rotate-180 transform' : '',
                    ' h-5 w-5 text-purple-500'
                  )}
                />
              </div>
            </Disclosure.Button>

            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="p-5 text-gray-500">
                transaction details
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </div>
  );
}

export default Transation;
