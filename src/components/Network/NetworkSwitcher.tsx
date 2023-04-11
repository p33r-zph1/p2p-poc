import Image from 'next/image';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const networksImages = [
  // { ids: [1, 5], icon: '/images/ethereum.svg' },
  // { ids: [137, 80001], icon: '/images/polygon.svg' },
  { ids: [56, 97], icon: '/images/bnb.svg' },
];

function NetworkSwitcher() {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  const chainImg = useMemo(
    () => networksImages.find(n => n.ids.find(id => id === chain?.id)),
    [chain?.id]
  );

  const supportedNetwork = useMemo(
    () => chains.some(c => c.id === chain?.id),
    [chain?.id, chains]
  );

  return (
    <Listbox value={chain?.id} onChange={switchNetwork}>
      <div className="relative mt-1">
        <Listbox.Button
          className="
        inline-flex items-center justify-center rounded-4xl border border-[#E7E9EB] px-4 py-2 font-bold text-sleep-100
        hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-opacity-75"
        >
          {supportedNetwork && chainImg && (
            <Image
              src={chainImg.icon}
              width={24}
              height={24}
              alt={`${chain?.name} network`}
              className="sm:mr-2"
            />
          )}

          <span className="hidden sm:block sm:text-sm">
            {supportedNetwork ? chain?.name : 'Unsupported Network'}
          </span>
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-sleep-100 hover:text-sleep-200" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {chains.map((network, networkIdx) => (
              <Listbox.Option
                key={networkIdx}
                className={({ active }) =>
                  classNames(
                    active ? ' text-brand' : '',
                    'relative cursor-default select-none py-2 pl-10 pr-4'
                  )
                }
                value={network.id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate'
                      )}
                    >
                      {network.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default NetworkSwitcher;
