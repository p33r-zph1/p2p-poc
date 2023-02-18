import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Play } from '@next/font/google';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { classNames } from '@/utils';
import chainList from '@/constants/chains';
import Head from 'next/head';

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
  return (
    <div className={classNames(play.variable, 'bg-paper font-sans text-body')}>
      <Head>
        <title>P33R POC</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}
