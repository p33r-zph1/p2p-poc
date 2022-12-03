import { useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { Navigation } from '@/components/layout';
import { Transactions } from '@/components/Transactions';
import useMountedAccount from '@/hooks/useMountedAccount';
import useIsMounted from '@/hooks/useIsMounted';
import chains from '@/constants/chains';

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

  const mounted = useIsMounted();

  if (!mounted) return null; // TODO(dennis): display loading indicator while wagmi is hydrating

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        isConnecting={isConnecting}
        walletAddress={address as string}
        connectWallet={connect}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div className="mt-16 w-full md:mt-0">
          <div className="md:px-5 lg:px-10">
            <h1 className="text-xl font-semibold text-body md:text-2xl">
              Transactions
            </h1>

            <div className="mt-5">
              <Transactions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TransactionsPage;
