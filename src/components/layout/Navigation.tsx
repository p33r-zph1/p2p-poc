import Link from 'next/link';
import { useState } from 'react';

import AccountDetails from '../AccountDetails';
import { Logo, LogoIcon } from '../icons';
import { NetworkSwitcher } from '../Network';

function Navigation() {
  const [connected, setConnected] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        aria-label="navigate to home page"
        className="focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80"
      >
        <Logo className="hidden sm:block" />
        <LogoIcon className="rounded-md bg-brand text-white sm:hidden" />
      </Link>

      {!connected ? (
        <button
          className="rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80"
          onClick={() => setConnected(true)}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <NetworkSwitcher />
          <AccountDetails disconnectWallet={() => setConnected(false)} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
