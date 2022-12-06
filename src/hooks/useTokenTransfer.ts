import { onlyNumbers } from '@/utils';
import { utils } from 'ethers';
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useNetwork,
  Address,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';

interface Props {
  contractAddress?: Address;
  recipient: Address;
  amount: string;
}

function useTokenTransfer({ contractAddress, recipient, amount }: Props) {
  const { chain } = useNetwork();

  const { config, ...transferPreparation } = usePrepareContractWrite({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, utils.parseEther(onlyNumbers(amount))],
    chainId: chain?.id,
    enabled: Boolean(contractAddress) && Boolean(chain),
  });

  const { write, ...rest } = useContractWrite(config);

  return {
    transfer: write,
    transferPreparation,
    ...rest,
  };
}

export default useTokenTransfer;
