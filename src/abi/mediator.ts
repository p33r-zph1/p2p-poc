import { isAnEthereumChain } from '@/constants/chains';
import { Chain, Narrow } from 'viem';

import erc20abi from './erc20EthUsdCompatible.json';
import { erc20ABI } from 'wagmi';

export function erc20Mediator(chain: Chain | undefined): Narrow<any> {
  if (isAnEthereumChain(chain)) {
    return erc20abi;
  }

  return erc20ABI;
}
