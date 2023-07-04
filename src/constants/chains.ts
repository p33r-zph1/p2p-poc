import {
  mainnet as ethereum,
  goerli,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';
import type { Chain } from 'wagmi';

import { buildConfig } from './build';

// const ethChains = [ethereum, goerli];
const bnbChains = [bsc, bscTestnet];
const maticChains = [polygon, polygonMumbai];

const mainnetChains: Chain[] = [/* ethereum */ bsc, polygon];
const testnetChains: Chain[] = [/* goerli */ bscTestnet, polygonMumbai];

export function getCustomChainId(chain: Chain | undefined) {
  if (!chain) return undefined;

  // if (ethChains.some(c => c.id === chain.id)) return 'eth';
  if (bnbChains.some(c => c.id === chain.id)) return 'bnb';
  if (maticChains.some(c => c.id === chain.id)) return 'matic';

  return undefined;
}

export default buildConfig.isProdOrStaging ? mainnetChains : testnetChains;
