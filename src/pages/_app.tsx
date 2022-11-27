import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';

import { classNames } from '@/utils';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={classNames(inter.variable, ' bg-paper font-sans text-body')}
    >
      <Component {...pageProps} />;
    </div>
  );
}
