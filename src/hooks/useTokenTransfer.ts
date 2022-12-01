import { BigNumber, utils } from 'ethers';
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useNetwork,
} from 'wagmi';

interface Props {
  contractAddress: `0x${string}`;
  recipient: `0x${string}`;
  amount: string;
}

export default function useTokenTransfer({
  contractAddress,
  recipient,
  amount,
}: Props) {
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, utils.parseEther(amount)],
    chainId: chain?.id || -1,
  });

  const { write } = useContractWrite(config);

  return {
    transfer: write,
  };
}
