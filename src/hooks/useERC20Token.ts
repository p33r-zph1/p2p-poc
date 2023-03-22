import { onlyNumbers } from '@/utils';
import { utils } from 'ethers';
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useNetwork,
  Address,
} from 'wagmi';

interface TokenApproval {
  tokenAddress: Address | undefined;
  spenderAddress: Address | undefined;
  amount: string;
}

export function useTokenApprove({
  tokenAddress,
  spenderAddress,
  amount,
}: TokenApproval) {
  const { chain } = useNetwork();

  const { config, ...approvePreparation } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spenderAddress!, utils.parseEther(onlyNumbers(amount))],
    chainId: chain?.id,
    enabled: Boolean(tokenAddress) && Boolean(spenderAddress) && Boolean(chain),
  });

  const { write, ...rest } = useContractWrite(config);

  return {
    approve: write,
    approvePreparation,
    ...rest,
  };
}

// other erc20 token functions
