import { useState } from 'react';

import { Navigation } from '@/components/layout';
import { useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { AddPaymentDetails, TokensForm } from '@/components/Tokens';
import { MarketChart } from '@/components/MarketChart';
import { classNames } from '@/utils';
import useMountedAccount from '@/hooks/useMountedAccount';

export interface PaymentDetails {
  country: string;
  mobileNumber: string;
}

function Home() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useMountedAccount();

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        walletAddress={address as string}
        connectWallet={connect}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div
          className={classNames(
            isConnected ? 'md:grid-cols-2' : '',
            'mt-16 md:mt-0 md:grid md:justify-center md:gap-10 lg:mx-auto lg:max-w-5xl'
          )}
        >
          <TokensForm
            paymentDetails={paymentDetails}
            connected={isConnected}
            connectWallet={connect}
          />

          {isConnected && paymentDetails && <MarketChart />}

          {!paymentDetails && isConnected && (
            <AddPaymentDetails
              addPaymentDetails={setPaymentDetails}
              walletAddress={address}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
