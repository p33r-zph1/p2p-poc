import { Chain } from 'wagmi';

import {
  ethereum,
  goerli,
  bsc,
  bscTest,
  polygon,
  polygonMumbai,
} from './chains';

export type Token = {
  contractAddress: `0x${string}`;
  symbol: string;
  icon: string;
  id: string;
};

export type Tokens = {
  chainId: number;
  tokens: Token[];
};

export const ethereumTokens: Tokens = {
  chainId: ethereum.id,
  tokens: [
    {
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      icon: '/images/ethereum.svg',
      id: 'tether',
    },
    {
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      icon: '/images/ethereum.svg',
      id: 'usd-coin',
    },
    {
      contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      icon: '/images/ethereum.svg',
      id: 'dai',
    },
  ],
};

export const goerliTokens: Tokens = {
  chainId: goerli.id,
  tokens: [
    {
      contractAddress: '0x4C339e04F85DA4a4CE55Ce74e96AA3A4B49c7B62',
      symbol: 'USDT',
      icon: '/images/ethereum.svg',
      id: 'tether',
    },
    {
      contractAddress: '0x99D572B6B04ae564A9a61239A6dc744A573FFb4D',
      symbol: 'USDC',
      icon: '/images/ethereum.svg',
      id: 'usd-coin',
    },
    {
      contractAddress: '0x75BB3ff44dd7bF8645fC1Ba9c5148e765055c319',
      symbol: 'DAI',
      icon: '/images/ethereum.svg',
      id: 'dai',
    },
  ],
};

export const bscTokens: Tokens = {
  chainId: bsc.id,
  tokens: [
    {
      contractAddress: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'BSC-USD',
      icon: '/images/bnb.svg',
      id: 'tether',
    },
    {
      contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      icon: '/images/bnb.svg',
      id: 'usd-coin',
    },
    {
      contractAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      symbol: 'DAI',
      icon: '/images/bnb.svg',
      id: 'dai',
    },
  ],
};

export const bscTestTokens: Tokens = {
  chainId: bscTest.id,
  tokens: [
    {
      contractAddress: '0x99D572B6B04ae564A9a61239A6dc744A573FFb4D',
      symbol: 'BSC-USD',
      icon: '/images/bnb.svg',
      id: 'tether',
    },
    {
      contractAddress: '0x75BB3ff44dd7bF8645fC1Ba9c5148e765055c319',
      symbol: 'USDC',
      icon: '/images/bnb.svg',
      id: 'usd-coin',
    },
    {
      contractAddress: '0x0009dEF2AEef8131628cc02c7e0Ad8354bb1D71C',
      symbol: 'DAI',
      icon: '/images/bnb.svg',
      id: 'dai',
    },
  ],
};

export const polygonTokens: Tokens = {
  chainId: polygon.id,
  tokens: [
    {
      contractAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      symbol: 'USDT',
      icon: '/images/polygon.svg',
      id: 'tether',
    },
    {
      contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      symbol: 'USDC',
      icon: '/images/polygon.svg',
      id: 'usd-coin',
    },
    {
      contractAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      symbol: 'DAI',
      icon: '/images/polygon.svg',
      id: 'dai',
    },
  ],
};

export const mumbaiTokens: Tokens = {
  chainId: polygonMumbai.id,
  tokens: [],
};

// default/fallback to ethereum mainnet
export const fallbackTokens = ethereumTokens.tokens;

export function fromChain(chain?: Chain): Token[] {
  if (!chain) return fallbackTokens;

  if (chain.id === ethereumTokens.chainId) return ethereumTokens.tokens;
  if (chain.id === goerliTokens.chainId) return goerliTokens.tokens;
  if (chain.id === bscTokens.chainId) return bscTokens.tokens;
  if (chain.id === bscTestTokens.chainId) return bscTestTokens.tokens;
  if (chain.id === polygonTokens.chainId) return polygonTokens.tokens;
  if (chain.id === mumbaiTokens.chainId) return mumbaiTokens.tokens;

  return fallbackTokens;
}
