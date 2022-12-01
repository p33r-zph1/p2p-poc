import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import chainList from '../constants/chains';

import { classNames } from '@/utils';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
  connectors: [
    new MetaMaskConnector({
      chains: chainList,
    }),
  ],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <div
        className={classNames(inter.variable, ' bg-paper font-sans text-body')}
      >
        <Component {...pageProps} />;
      </div>
    </WagmiConfig>
  );
}
