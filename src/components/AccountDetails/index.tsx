import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { WalletIcon } from '../icons';
import { classNames, shortenAddress } from '@/utils';

interface Props {
  disconnectWallet(): void;
}

function AccountDetails({ disconnectWallet }: Props) {
  return (
    <Menu as="div" className="relative text-left">
      <Menu.Button
        className="
        inline-flex items-center justify-center rounded-4xl border border-[#E7E9EB] px-4 py-2 font-bold text-sleep-100
        hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-opacity-75"
      >
        <WalletIcon className="mr-2 text-white" />
        <span className="text-xs sm:text-sm">
          {shortenAddress('0x9Ceb110B007E4189ea2C01118742F069F2cfFb4d')}
        </span>
        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-sleep-100 hover:text-sleep-200" />
      </Menu.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="space-y-2 divide-y divide-gray-100 text-sm">
            <div className="space-y-2 px-3 pt-2">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={classNames(active ? 'text-brand' : '', 'block')}
                    href="/transactions"
                  >
                    Transactions
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={classNames(active ? 'text-brand' : '', 'block')}
                    href="/account-settings"
                  >
                    Account Settings
                  </Link>
                )}
              </Menu.Item>
            </div>

            <div className="space-y-2 px-3 py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(active ? 'text-brand' : '', 'block')}
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </button>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default AccountDetails;
