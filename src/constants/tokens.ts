import { Address, Chain } from 'wagmi';

import {
  mainnet as ethereum,
  sepolia,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli
} from 'wagmi/chains';
import { xrplSidechain } from './custom-chains';

export type Token = {
  contractAddress: Address | undefined; // explicitly specify type
  symbol: string;
  icon: string;
  id: string;
  decimals: number;
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
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6
    },
    {
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const sepoliaTokens: Tokens = {
  chainId: sepolia.id,
  tokens: [
    {
      contractAddress: '0x7548A071513982db09b2af5a60Ab29a29f5b3ae3',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6
    },
    {
      contractAddress: '0x177f4a319881754B3B5c2d8346517830083Ad06B',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0x61251F8dE99fd1C2738a68f98f631fB26375db36',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const bscTokens: Tokens = {
  chainId: bsc.id,
  tokens: [
    {
      contractAddress: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 18
    },
    {
      contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 18
    },
    {
      contractAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const bscTestTokens: Tokens = {
  chainId: bscTestnet.id,
  tokens: [
    {
      contractAddress: '0x99D572B6B04ae564A9a61239A6dc744A573FFb4D',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 18
    },
    {
      contractAddress: '0x75BB3ff44dd7bF8645fC1Ba9c5148e765055c319',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 18
    },
    {
      contractAddress: '0x0009dEF2AEef8131628cc02c7e0Ad8354bb1D71C',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const polygonTokens: Tokens = {
  chainId: polygon.id,
  tokens: [
    {
      contractAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6,
    },
    {
      contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const mumbaiTokens: Tokens = {
  chainId: polygonMumbai.id,
  tokens: [
    {
      contractAddress: '0xE8e311CaFB3D86AdEd2f0DE6e53B6c6A97e16699',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6
    },
    {
      contractAddress: '0x7BD733a4B36d30e49368295C44f9BDB79d4c59aa',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0x99D572B6B04ae564A9a61239A6dc744A573FFb4D',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const arbitrumTokens: Tokens = {
  chainId: arbitrum.id,
  tokens: [
    {
      contractAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6,
    },
    {
      contractAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const arbitrumGoerliTokens: Tokens = {
  chainId: arbitrumGoerli.id,
  tokens: [
    {
      contractAddress: '0x61F21D573cF45Bfe701a4708D7Ac97516dcAf9c1',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 6
    },
    {
      contractAddress: '0x61251F8dE99fd1C2738a68f98f631fB26375db36',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 6
    },
    {
      contractAddress: '0xb248c0Bc1C0781A882bEc20Ef36757864119F4c1',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export const xrplSidechainTokens: Tokens = {
  chainId: xrplSidechain.id,
  tokens: [
    {
      contractAddress: '0x3d68b51cc19B279A24d280e69C8A60Ee0E0Dfd74',
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 18
    },
    {
      contractAddress: '0xb248c0Bc1C0781A882bEc20Ef36757864119F4c1',
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 18
    },
    {
      contractAddress: '0xD17882595618F3C652fC6B7E368f7324719b3838',
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

// default/fallback tokens with undefined contract address
export const fallbackTokens: Tokens = {
  chainId: -1,
  tokens: [
    {
      contractAddress: undefined,
      symbol: 'USDT',
      icon: '/images/usdt.svg',
      id: 'tether',
      decimals: 18
    },
    {
      contractAddress: undefined,
      symbol: 'USDC',
      icon: '/images/usdc.svg',
      id: 'usd-coin',
      decimals: 18
    },
    {
      contractAddress: undefined,
      symbol: 'DAI',
      icon: '/images/dai.svg',
      id: 'dai',
      decimals: 18
    },
  ],
};

export function fromChain(chain: Chain | undefined): Token[] {
  // console.log('checking for token and chain');
  // console.log({
  //   chain,
  //   mumbaiTokens: mumbaiTokens.tokens,
  //   polygonTokens: polygonTokens.tokens,
  // });

  if (!chain) return fallbackTokens.tokens;

  if (chain.id === ethereumTokens.chainId) return ethereumTokens.tokens;
  if (chain.id === sepoliaTokens.chainId) return sepoliaTokens.tokens;
  if (chain.id === bscTokens.chainId) return bscTokens.tokens;
  if (chain.id === bscTestTokens.chainId) return bscTestTokens.tokens;
  if (chain.id === polygonTokens.chainId) return polygonTokens.tokens;
  if (chain.id === mumbaiTokens.chainId) return mumbaiTokens.tokens;
  if (chain.id === arbitrumTokens.chainId) return arbitrumTokens.tokens;
  if (chain.id === arbitrumGoerliTokens.chainId) return arbitrumGoerliTokens.tokens;
  if (chain.id === xrplSidechainTokens.chainId)
    return xrplSidechainTokens.tokens;

  return fallbackTokens.tokens;
}
