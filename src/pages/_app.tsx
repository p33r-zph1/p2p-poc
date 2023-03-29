import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Play } from '@next/font/google';
import { useMemo } from 'react';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { classNames } from '@/utils';
import chainList from '@/constants/chains';
import { getPrintableEnvName } from '@/constants/build';

/** @see https://wagmi.sh/examples/connect-wallet#step-1-configuring-connectors */
const { chains, provider, webSocketProvider } = configureChains(chainList, [
  publicProvider(),
]);

// Set up client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    /** @see https://wagmi.sh/react/connectors/injected */
    new InjectedConnector({
      chains,
      options: {
        name: detectedName =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const queryClient = new QueryClient();

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
});

export default function App({ Component, pageProps }: AppProps) {
  const appTitle = useMemo(() => `P33R POC ${getPrintableEnvName()}`, []);

  return (
    <div className={classNames(play.variable, 'bg-paper font-sans text-body')}>
      <Head>
        <title>{appTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        :root {
          --font-play: ${play.style.fontFamily};
        }
      `}</style>

      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}
