import { MouseEventHandler, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils';
import { BankInfo } from '@/hooks/useOnboarding';

interface Props {
  bankInfo: BankInfo;
  unlink: () => void;
  lastItem?: boolean;
}

function StatusBadge() {
  return (
    <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
      <p className="text-sm text-[#4FA355]">Verified</p>
    </div>
  );
}

function Account({ bankInfo, unlink, lastItem }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    bankDetails: { accountName, accountNumber, bankName, countryCode },
  } = bankInfo;

  const confirmReceipt: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();

    // TODO(Dennis): you can do the confirmation here

    setIsOpen(true);
  };

  return (
    <div className={classNames(lastItem ? '' : 'border-b')}>
      <Disclosure>
        {({ open }) => (
          <div className="p-5">
            <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-brand focus-visible:ring-opacity-75">
              <div className="space-y-2">
                <p className="text-xs font-semibold sm:text-sm md:text-lg">
                  {accountName} ({accountNumber})
                </p>
                <p className="flex items-center space-x-2 text-sleep-100">
                  <span className="font-bold">{countryCode.toUpperCase()}</span>
                  <span
                    className="block h-1 w-1 rounded-full bg-sleep-100"
                    aria-hidden
                  />
                  <span>{bankName}</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <StatusBadge />

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
              className="m-4"
            >
              {/* <Disclosure.Panel className="p-1 text-gray-500">
                Country Code: {countryCode}
              </Disclosure.Panel> */}

              <button
                className="rounded-4xl bg-mad px-4 py-3 text-sm font-bold text-white hover:bg-mad/90 focus:outline-none focus:ring focus:ring-mad/80 active:bg-mad/80 disabled:bg-sleep disabled:text-sleep-300"
                onClick={unlink}
              >
                Unlink
              </button>
            </Transition>
          </div>
        )}
      </Disclosure>

      {/* <SuccessfulTransactionModal
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        transaction={transaction}
      /> */}
    </div>
  );
}

export default Account;
