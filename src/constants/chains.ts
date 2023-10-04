import {
  mainnet as ethereum,
  sepolia,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
} from 'wagmi/chains';
import type { Chain } from 'wagmi';

import { buildConfig } from './build';
import { xrplSidechain } from './custom-chains';

const ethChains = [ethereum, sepolia];
const bnbChains = [bsc, bscTestnet];
const maticChains = [polygon, polygonMumbai];
const arbitrumChains = [arbitrum, arbitrumGoerli];
const xrplChains = [xrplSidechain];

const mainnetChains: Chain[] = [ethereum, bsc, polygon, arbitrum];
const testnetChains: Chain[] = [
  sepolia,
  bscTestnet,
  polygonMumbai,
  arbitrumGoerli,
  xrplSidechain,
];

export function getCustomChainId(chain: Chain | undefined) {
  if (!chain) return undefined;

  if (ethChains.some(c => c.id === chain.id)) return 'eth';
  if (bnbChains.some(c => c.id === chain.id)) return 'bnb';
  if (maticChains.some(c => c.id === chain.id)) return 'matic';
  if (arbitrumChains.some(c => c.id === chain.id)) return 'arb';
  if (xrplChains.some(c => c.id === chain.id)) return 'xrpl';

  return undefined;
}

export default buildConfig.isProdOrStaging ? mainnetChains : testnetChains;
