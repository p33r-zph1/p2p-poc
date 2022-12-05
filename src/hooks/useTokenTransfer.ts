import { onlyNumbers } from '@/utils';
import { utils } from 'ethers';
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useNetwork,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';

interface Props {
  contractAddress?: `0x${string}`;
  recipient: `0x${string}`;
  amount: string;
}

function useTokenTransfer({ contractAddress, recipient, amount }: Props) {
  const { chain } = useNetwork();

  const { config, error: preparationError } = usePrepareContractWrite({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, utils.parseEther(onlyNumbers(amount))],
    chainId: chain?.id || mainnet.id, // fallback to mainnet
  });

  const { write, ...rest } = useContractWrite(config);

  return {
    transfer: write,
    preparationError,
    ...rest,
  };
}

export default useTokenTransfer;
