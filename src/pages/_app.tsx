import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Play } from '@next/font/google';
import { useMemo } from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { classNames } from '@/utils';
import chainList from '@/constants/chains';
import { getPrintableEnvName } from '@/constants/build';

/** @see https://wagmi.sh/examples/connect-wallet#step-1-configuring-connectors */
const { chains, publicClient, webSocketPublicClient } = configureChains(
  chainList,
  [publicProvider()]
);

// Set up config
const wagmiConfig = createConfig({
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
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
});

export default function App({ Component, pageProps }: AppProps) {
  // const appTitle = useMemo(() => `P33R POC ${getPrintableEnvName()}`, []);

  return (
    <div className={classNames(play.variable, 'bg-paper font-sans text-body')}>
      <Head>
        <title>RAILS by P33R | Easily sell your stablecoins to fiat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        :root {
          --font-play: ${play.style.fontFamily};
        }
      `}</style>

      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}