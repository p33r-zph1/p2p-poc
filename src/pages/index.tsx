import { useState } from 'react';

import { Navigation } from '@/components/layout';
import { TokensForm } from '@/components/Tokens';

function Home() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={connected}
        connectWallet={() => setConnected(true)}
        disconnectWallet={() => setConnected(false)}
      />

      <main className="flex flex-1 items-center justify-center p-8 sm:px-10">
        <TokensForm
          connected={connected}
          connectWallet={() => setConnected(true)}
        />
      </main>
    </div>
  );
}

export default Home;
