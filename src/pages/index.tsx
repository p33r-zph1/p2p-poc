import { useState } from 'react';
import { Tab } from '@headlessui/react';

import { Navigation } from '@/components/layout';
import { AddPaymentDetails, TokensForm } from '@/components/Tokens';
import { RecentTransactions } from '@/components/Transactions';
import { PairPriceMatrix } from '@/components/PairPriceMatrix';
import { classNames } from '@/utils';
import useMountedAccount from '@/hooks/useMountedAccount';
import useIsMounted from '@/hooks/useIsMounted';
import useAuth from '@/hooks/useAuth';

export type PaymentField = {
  label: string;
  id: string;
  value: string;
};

export type PaymentDetails = {
  name: string;
  fields: PaymentField[];
};

const tabs = ['Market prices', 'Transactions'];

function Home() {
  const { connect, disconnect, connectProps } = useAuth();
  const { isConnected, address } = useMountedAccount();

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();

  const mounted = useIsMounted();

  if (!mounted) return null; // TODO(dennis): display loading indicator while wagmi is hydrating

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        isConnecting={connectProps.isLoading}
        walletAddress={address as string}
        connectWallet={connect}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:mt-8 lg:px-10">
        <div
          className={classNames(
            isConnected ? 'md:grid-cols-5' : '',
            'mt-16 w-full md:mt-0 md:grid md:justify-center md:gap-8'
          )}
        >
          <div className="col-span-2">
            <TokensForm
              isConnecting={connectProps.isLoading}
              paymentDetails={paymentDetails}
              connected={isConnected}
              connectWallet={connect}
            />
          </div>

          <div className="col-span-3">
            {isConnected && paymentDetails && (
              <Tab.Group
                as="div"
                className="flex w-full flex-col overflow-hidden rounded-xl"
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

                <Tab.Panels className="rounded-b-xl bg-white ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                  <Tab.Panel>
                    <PairPriceMatrix />
                  </Tab.Panel>
                  <Tab.Panel>
                    <RecentTransactions />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            )}

            {!paymentDetails && isConnected && (
              <AddPaymentDetails
                addPaymentDetails={setPaymentDetails}
                walletAddress={address}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
