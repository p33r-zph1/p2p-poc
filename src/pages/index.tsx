import { useCallback, useMemo, useState } from 'react';

import { Navigation } from '@/components/layout';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import {
  AddBankAccountForm,
  TokensForm,
  RecentTransactions,
} from '@/components/Tokens';
import { classNames } from '@/utils';
import useIsMounted from '@/hooks/useIsMounted';

export interface BankAccount {
  country: string;
  bank: string;
  accountNumber: string;
  accountName: string;
}

function Home() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork();

  const [bankAccount, setBankAccount] = useState<BankAccount>();

  const isMounted = useIsMounted();

  const connectWalletHandler = useCallback(() => {
    try {
      connect();
    } catch (error) {
      console.error({ error });
    }
  }, [connect]);

  const walletConnected = useMemo(
    () => isConnected && isMounted,
    [isConnected, isMounted]
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={walletConnected}
        walletAddress={address}
        chain={chain}
        chainList={chains}
        switchNetwork={chainId => switchNetwork?.(chainId)}
        connectWallet={connectWalletHandler}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div
          className={classNames(
            walletConnected ? 'md:grid-cols-2' : '',
            'mt-16 md:mt-0 md:grid md:justify-center md:gap-4 lg:mx-auto lg:max-w-5xl'
          )}
        >
          <TokensForm
            bankAccount={bankAccount}
            connected={walletConnected}
            connectWallet={connectWalletHandler}
          />

          {walletConnected && bankAccount && <RecentTransactions />}

          {!bankAccount && walletConnected && (
            <AddBankAccountForm addBankAccount={setBankAccount} />
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
