import { useState } from 'react';

import { Navigation } from '@/components/layout';
import { useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { AddPaymentDetails, TokensForm } from '@/components/Tokens';
import { PairPriceMatrix } from '@/components/PairPriceMatrix';
import { classNames } from '@/utils';
import useMountedAccount from '@/hooks/useMountedAccount';

export type PaymentField = {
  label: string;
  id: string;
  value: string;
};

export type PaymentDetails = {
  name: string;
  fields: PaymentField[];
};

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
            isConnected ? 'md:grid-cols-5' : '',
            'mt-16 w-full md:mt-0 md:grid md:justify-center md:gap-8'
          )}
        >
          <div className="col-span-2">
            <TokensForm
              paymentDetails={paymentDetails}
              connected={isConnected}
              connectWallet={connect}
            />
          </div>

          <div className="col-span-3">
            {isConnected && paymentDetails && <PairPriceMatrix />}

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
