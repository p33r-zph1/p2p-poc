import Image from 'next/image';
import { Fragment, ReactNode, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils';

interface Currency {
  name: string;
  icon?: string;
}

interface Props {
  currencies: Currency[];
  defaultSelected?: Currency;
  onChange?: (currency: Currency) => void;
}

function CurrencySelector({ currencies, defaultSelected, onChange }: Props) {
  const [selected, setSelected] = useState(defaultSelected || currencies[0]);

  return (
    <Listbox
      value={selected}
      onChange={value => {
        setSelected(value);

        if (onChange) {
          onChange(value);
        }
      }}
    >
      <div className="relative">
        <Listbox.Button
          className="
        inline-flex items-center justify-center rounded-4xl px-4 py-2 font-bold text-sleep-100
        hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-opacity-75"
        >
          {selected.icon && (
            <Image
              src={selected.icon}
              width={24}
              height={24}
              alt={`${selected.name} network`}
              className="mr-2"
            />
          )}
          <span className="sm:text-sm">{selected.name}</span>
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-sleep-100 hover:text-sleep-200" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {currencies.map((currency, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  classNames(
                    active ? ' text-brand' : '',
                    'relative cursor-default select-none py-2 pl-10 pr-4'
                  )
                }
                value={currency}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate'
                      )}
                    >
                      {currency.name}
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

export default CurrencySelector;
