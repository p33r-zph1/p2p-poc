import { onlyNumbers } from '@/utils';
import { parseUnits } from 'viem';
import erc20ABI from '../abi/erc20.json'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  Address,
} from 'wagmi';

interface TokenApproval {
  tokenAddress: Address | undefined;
  tokenDecimals: number | undefined;
  spenderAddress: Address | undefined;
  amount: string;
}

export function useTokenApprove({
  tokenAddress,
  tokenDecimals,
  spenderAddress,
  amount,
}: TokenApproval) {
  const { chain } = useNetwork();

  const { config, ...approvePreparation } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      spenderAddress!,
      parseUnits(onlyNumbers(amount), tokenDecimals || 0),
    ],
    chainId: chain?.id,
    enabled: Boolean(tokenAddress) && Boolean(spenderAddress) && Boolean(chain),
  });

  const { write, ...rest } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: rest.data?.hash,
  })

  return {
    approve: write,
    approvePreparation,
    ...rest,
    isLoading
  };
}

// other erc20 token functions
