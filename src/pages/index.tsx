import { useState } from 'react';

import { Navigation } from '@/components/layout';
import { TokensForm } from '@/components/Tokens';
import AddBankAccountForm from '@/components/Tokens/AddBankAccountForm';
import { classNames } from '@/utils';

export interface BankAccount {
  country: string;
  bank: string;
  accountNumber: string;
  accountName: string;
}

function Home() {
  const [connected, setConnected] = useState(false);
  const [bankAccount, setBankAccount] = useState<BankAccount>();

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
            bankAccount={bankAccount}
            connected={connected}
            connectWallet={() => setConnected(true)}
          />

          {!bankAccount && connected && (
            <AddBankAccountForm addBankAccount={setBankAccount} />
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
