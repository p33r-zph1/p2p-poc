import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  Address,
} from 'wagmi';

import { ESCROW_ABI_V1 } from '../abi';
import { stringToHex } from 'viem';
// import { encodeBytes32String } from 'ethers';

interface Escrow {
  referenceId: string;
  contractAddress: Address | undefined;
  refundable: boolean;
}

export function useEscrowContract({
  referenceId,
  contractAddress,
  refundable,
}: Escrow) {
  const { chain } = useNetwork();

  // console.log({
  //   canRefund:
  //     Boolean(referenceId) &&
  //     Boolean(contractAddress) &&
  //     Boolean(chain) &&
  //     refundable,
  //   // referenceId: Boolean(referenceId),
  //   // contractAddress: Boolean(contractAddress),
  //   // chain: Boolean(chain),
  // });

  const { config, ...refundPreparation } = usePrepareContractWrite({
    address: contractAddress,
    abi: ESCROW_ABI_V1,
    functionName: 'refundAfterExpiry',
    args: [stringToHex(referenceId, { size: 32 })], // https://viem.sh/docs/ethers-migration.html#formatbytes32string
    chainId: chain?.id,
    enabled:
      Boolean(referenceId) &&
      Boolean(contractAddress) &&
      Boolean(chain) &&
      refundable,
  });

  const { write, writeAsync, ...rest } = useContractWrite(config);

  return {
    refundAfterExpiry: write,
    refundAfterExpiryAsync: writeAsync,
    refundPreparation,
    ...rest,
  };
}
