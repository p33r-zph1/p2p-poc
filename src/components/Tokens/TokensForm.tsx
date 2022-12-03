import { Tab } from '@headlessui/react';

import { classNames } from '@/utils';
import { PaymentDetails } from '@/pages';
import BuyTokens from './BuyTokens';
import SellTokens from './SellTokens';

const tabs = ['Buy', 'Sell'];

interface Props {
  paymentDetails?: PaymentDetails;
  connected: boolean;
  isConnecting: boolean;
  connectWallet(): void;
}

function TokensForm({
  paymentDetails,
  connected,
  connectWallet,
  isConnecting,
}: Props) {
  return (
    <Tab.Group
      as="div"
      className="flex w-full flex-col overflow-hidden rounded-xl md:max-w-md"
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
          'bg-white px-5 py-10 lg:px-10',
          'rounded-b-xl ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
        )}
      >
        <Tab.Panel>
          <BuyTokens
            isConnecting={isConnecting}
            paymentDetails={paymentDetails}
            connected={connected}
            connectWallet={connectWallet}
          />
        </Tab.Panel>
        <Tab.Panel>
          <SellTokens
            isConnecting={isConnecting}
            paymentDetails={paymentDetails}
            connected={connected}
            connectWallet={connectWallet}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default TokensForm;
