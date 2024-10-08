import { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/layout';
import { Transactions } from '@/components/Transactions';
import useIsMounted from '@/hooks/useIsMounted';
import useTransactions from '@/hooks/useTransactionList';
import useAuth from '@/hooks/useAuth';
import { useEscrow } from '@/hooks/useGetEscrow';
import { getCustomChainId } from '@/constants/chains';
import { useNetwork } from 'wagmi';
import { useEscrowContract } from '@/hooks/useEscrowContract';
import { getErrorMessage } from '@/utils/isError';

function TransactionsPage() {
  const {
    connect,
    disconnect,
    connectProps,
    isConnected,
    address,
    hasError,
    setHasError,
  } = useAuth();
  const { chain } = useNetwork();
  const { data, isFetching } = useTransactions({ walletAddress: address });

  const mounted = useIsMounted();

  const { data: escrowData, refetch: fetchEscrow } = useEscrow({
    walletAddress: address,
    customChainId: getCustomChainId(chain),
  });

  useEffect(() => {
    if (!address) return;

    fetchEscrow();
  }, [address, fetchEscrow]);

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

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div className="mt-16 w-full md:mt-0">
          <div className="md:px-5 lg:px-10">
            {isConnected ? (
              <>
                {hasError ? (
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
                      When your active address in MetaMask <b>does not match</b>{' '}
                      the address in P33R, make sure that your selected account
                      in MetaMask is connected.
                    </p>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-semibold text-body md:text-2xl">
                      Transactions
                    </h1>

                    <div className="my-3">
                      {/* {isFetching ? (
                        <div className="h-2.5 w-12 animate-pulse rounded-full bg-gray-300"></div>
                      ) : ( */}
                      <p className="text-sm text-sleep-100">
                        {data?.length} results
                      </p>
                      {/* )} */}
                    </div>

                    <div className="my-5">
                      <Transactions
                        refundContractAddress={escrowData?.sell}
                        walletAddress={address}
                        setHasError={setHasError}
                        maxLimit="all"
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-md rounded-xl bg-white p-5">
                <h3 className="m-5 text-center font-sans text-xl font-semibold md:text-2xl">
                  Please connect your wallet
                </h3>

                <button
                  type="button"
                  className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                  disabled={connectProps.isLoading}
                  onClick={connect}
                >
                  {connectProps.isLoading ? 'Connecting...' : 'Connect Wallet'}
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
