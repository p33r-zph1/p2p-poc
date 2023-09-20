import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  Address,
} from 'wagmi';

import { ESCROW_ABI_V1 } from '../abi';
import { formatBytes32String } from 'ethers/lib/utils.js';

interface Escrow {
  referenceId: string;
  contractAddress: Address | undefined;
}

export function useEscrowContract({ referenceId, contractAddress }: Escrow) {
  const { chain } = useNetwork();

  const { config, ...refundPreparation } = usePrepareContractWrite({
    address: contractAddress,
    abi: ESCROW_ABI_V1,
    functionName: 'refundAfterExpiry',
    args: [formatBytes32String(referenceId)],
    chainId: chain?.id,
    enabled: Boolean(referenceId) && Boolean(contractAddress) && Boolean(chain),
  });

  const { write, ...rest } = useContractWrite(config);

  return {
    refundAfterExpiry: write,
    refundPreparation,
    ...rest,
  };
}
