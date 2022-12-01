import { useState } from 'react';

import { Navigation } from '@/components/layout';
import {
  AddPaymentDetails,
  TokensForm,
  RecentTransactions,
} from '@/components/Tokens';
import { classNames } from '@/utils';

export interface PaymentDetails {
  country: string;
  mobileNumber: string;
}

function Home() {
  const [connected, setConnected] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={connected}
        connectWallet={() => setConnected(true)}
        disconnectWallet={() => setConnected(false)}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div
          className={classNames(
            connected ? 'md:grid-cols-2' : '',
            'mt-16 md:mt-0 md:grid md:justify-center md:gap-4 lg:mx-auto lg:max-w-5xl'
          )}
        >
          <TokensForm
            paymentDetails={paymentDetails}
            connected={connected}
            connectWallet={() => setConnected(true)}
          />

          {connected && paymentDetails && <RecentTransactions />}

          {!paymentDetails && connected && (
            <AddPaymentDetails
              addPaymentDetails={setPaymentDetails}
              walletAddress="0x9Ceb110B007E4189ea2C01118742F069F2cfFb4d"
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
