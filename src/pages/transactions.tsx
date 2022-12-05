import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { Navigation } from '@/components/layout';
import { Transactions } from '@/components/Transactions';
import useMountedAccount from '@/hooks/useMountedAccount';
import useIsMounted from '@/hooks/useIsMounted';
import chains from '@/constants/chains';
import useTransactions from '@/hooks/useTransactions';

export type PaymentField = {
  label: string;
  id: string;
  value: string;
};

export type PaymentDetails = {
  name: string;
  fields: PaymentField[];
};

function TransactionsPage() {
  const { connect, isLoading: isConnecting } = useConnect({
    // Manually setting up the connector to only use MetaMask
    // If we want to support other wallets, use the connectors prop from useConnect() hook and remove the connector below)
    // https://wagmi.sh/examples/connect-wallet
    connector: new MetaMaskConnector({
      chains,
    }),
  });
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useMountedAccount();
  const { data, isFetching } = useTransactions();

  const mounted = useIsMounted();

  const connectWallet = useCallback(() => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://metamask.io/', '_blank', 'noopener,noreferrer');
    }

    connect();
  }, [connect]);

  if (!mounted) return null; // TODO(dennis): display loading indicator while wagmi is hydrating

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        isConnecting={isConnecting}
        walletAddress={address as string}
        connectWallet={connectWallet}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div className="mt-16 w-full md:mt-0">
          <div className="md:px-5 lg:px-10">
            {isConnected ? (
              <>
                <h1 className="text-xl font-semibold text-body md:text-2xl">
                  Transactions
                </h1>

                <div className="my-3">
                  {isFetching ? (
                    <div className="h-2.5 w-12 animate-pulse rounded-full bg-gray-300"></div>
                  ) : (
                    <p className="text-sm text-sleep-100">
                      {data?.length} results
                    </p>
                  )}
                </div>

                <div className="my-5">
                  <Transactions />
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-md rounded-xl bg-white p-5">
                <h3 className="m-5 text-center font-sans text-xl font-semibold md:text-2xl">
                  Please connect your wallet
                </h3>

                <button
                  type="button"
                  className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                  disabled={isConnecting}
                  onClick={connectWallet}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TransactionsPage;
