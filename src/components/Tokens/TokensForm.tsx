import { Tab } from '@headlessui/react';
import { Address } from 'wagmi';

import { classNames } from '@/utils';
import { BankInfo } from '@/hooks/useOnboarding';
import { Currency } from '@/constants/currency';
import { Token } from '@/constants/tokens';

import BuyTokens from './BuyTokens';
import SellTokens from './SellTokens';
import { Dispatch, SetStateAction } from 'react';

const tabs = [
  {
    key: 'Sell',
    disabled: false,
  },
  {
    key: 'Buy',
    disabled: true,
  },
];

interface Props {
  bankInfo: BankInfo | undefined;
  walletAddress: Address | undefined;
  connected: boolean;
  isConnecting: boolean;
  connectWallet(): void;
  setPair: Dispatch<
    SetStateAction<
      Partial<{
        token: Token;
        fiat: Currency;
      }>
    >
  >;
}

function TokensForm({
  bankInfo,
  walletAddress,
  connected,
  connectWallet,
  isConnecting,
  setPair,
}: Props) {
  return (
    <Tab.Group
      as="div"
      className="flex w-full flex-col overflow-hidden rounded-xl md:max-w-md"
    >
      <Tab.List className="flex space-x-1 bg-[#E7E9EB]">
        {tabs.map(tab => (
          <Tab
            key={tab.key}
            disabled={tab.disabled}
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
            {tab.key}
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
          <SellTokens
            isConnecting={isConnecting}
            walletAddress={walletAddress}
            bankInfo={bankInfo}
            connected={connected}
            connectWallet={connectWallet}
            setPair={setPair}
          />
        </Tab.Panel>
        <Tab.Panel>
          <BuyTokens
            isConnecting={isConnecting}
            walletAddress={walletAddress}
            bankInfo={bankInfo}
            connected={connected}
            connectWallet={connectWallet}
            setPair={setPair}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default TokensForm;
