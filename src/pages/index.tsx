import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { Navigation } from '@/components/layout';
import { AddPaymentDetails, TokensForm } from '@/components/Tokens';
import { RecentTransactions } from '@/components/Transactions';
import { PairPriceMatrix } from '@/components/PairPriceMatrix';
import { classNames } from '@/utils';
import useIsMounted from '@/hooks/useIsMounted';
import useAuth from '@/hooks/useAuth';
import { saveUser, useGetUser } from '@/hooks/useOnboarding';
import { Token } from '@/constants/tokens';
import { Currency } from '@/constants/currency';
import { paymentCountries } from '@/constants/payment';

const tabs = ['Transactions', 'Market prices'];

function Home() {
  const {
    connect,
    disconnect,
    connectProps,
    isConnected,
    address,
    hasError,
    setHasError,
  } = useAuth();

  const {
    data: bankInfo,
    isLoading: isLoadingUser,
    refetch: refetchBankInfo,
  } = useGetUser(address);

  const [pair, setPair] = useState<
    Partial<{
      token: Token;
      fiat: Currency;
    }>
  >({});

  const [countryFallback, setCountryFallback] = useState(paymentCountries[0]);

  const mounted = useIsMounted();

  if (!mounted) return null; // TODO(dennis): display loading indicator while wagmi is hydrating

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        isConnecting={connectProps.isLoading}
        walletAddress={address}
        connectWallet={connect}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:mt-8 lg:px-10">
        <div
          className={classNames(
            isConnected && !hasError ? 'md:grid-cols-5' : '',
            'mt-16 w-full md:mt-0 md:grid md:justify-center md:gap-8'
          )}
        >
          {!hasError && (
            <>
              <div className="col-span-2">
                <TokensForm
                  fallbackFiatCurrency={countryFallback.currency}
                  isConnecting={connectProps.isLoading}
                  walletAddress={address}
                  bankInfo={bankInfo}
                  connected={isConnected}
                  connectWallet={connect}
                  setPair={setPair}
                />
              </div>

              <div className="col-span-3">
                {(() => {
                  if (!isConnected) return;

                  // TODO(dennis): check for error - return a JSX

                  // TODO(dennis): improve loading feedback
                  if (isLoadingUser) {
                    return <p>Please wait...</p>;
                  }

                  if (!bankInfo) {
                    return (
                      <AddPaymentDetails
                        setCountryFallback={setCountryFallback}
                        saveBankInfo={bankInfo => saveUser(address, bankInfo)}
                        refectchBankInfo={refetchBankInfo}
                        walletAddress={address}
                      />
                    );
                  }

                  return (
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
                          <RecentTransactions
                            walletAddress={address}
                            setHasError={setHasError}
                          />
                        </Tab.Panel>
                        <Tab.Panel>
                          <PairPriceMatrix
                            token={pair.token}
                            fiat={pair.fiat}
                          />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  );
                })()}
              </div>
            </>
          )}

          {hasError && (
            <div className="mx-auto max-w-md rounded-xl bg-white p-5">
              <h1 className="m-5 text-center font-sans text-xl font-semibold md:text-2xl">
                {hasError}
              </h1>

              <button
                type="button"
                className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                onClick={() => disconnect()}
              >
                Disconnect Wallet
              </button>

              <p className="mt-10 text-center text-sm">
                When your active address in MetaMask <b>does not match</b> the
                address in P33R, make sure that your selected account in
                MetaMask is connected.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
