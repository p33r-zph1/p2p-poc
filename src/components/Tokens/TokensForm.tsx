import { classNames } from '@/utils';
import { Tab } from '@headlessui/react';

import BuyTokens from './BuyTokens';
import SellTokens from './SellTokens';

const tabs = ['Buy', 'Sell'];

function TokensForm() {
  return (
    <Tab.Group
      as="div"
      className="flex w-full flex-col overflow-hidden rounded-xl bg-white sm:w-[400px]"
    >
      <Tab.List className="flex space-x-1 bg-[#E7E9EB]">
        {tabs.map(tabName => (
          <Tab
            key={tabName}
            className={({ selected }) =>
              classNames(
                'w-full p-5 text-xl font-bold leading-5 sm:text-2xl',
                'focus:text-slate-300 focus:outline-none',
                selected
                  ? 'rounded-tl-xl rounded-tr-xl bg-white text-body'
                  : 'text-sleep-200 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            {tabName}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels
        className={classNames(
          'bg-white p-5 sm:p-10',
          'rounded-xl ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
        )}
      >
        <Tab.Panel>
          <BuyTokens />
        </Tab.Panel>
        <Tab.Panel>
          <SellTokens />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default TokensForm;
