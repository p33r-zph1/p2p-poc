import { Chain } from '@wagmi/core';

export const xrplSidechain = {
  id: 1440002,
  name: 'XRPL Sidechain',
  network: 'xrpl',
  nativeCurrency: {
    decimals: 18,
    name: 'XRP',
    symbol: 'XRP',
  },
  rpcUrls: {
    public: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
    default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
  },
  blockExplorers: {
    default: { name: 'XRPL Sidechain', url: 'https://evm-sidechain.xrpl.org' },
  },
} as const satisfies Chain;
