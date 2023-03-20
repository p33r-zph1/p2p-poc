import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

// import { ServiceType } from './useTokens';

interface TransactionResponse {
  message: string;
  data: null;
  copyright: string;
}

interface DisputeTransaction {
  walletAddress: Address | undefined;
  referenceId: string | undefined;
}

interface Props {
  // type: ServiceType;
  disputeTransaction: DisputeTransaction;
}

export async function disputeTransaction({ disputeTransaction }: Props) {
  const { referenceId, walletAddress } = disputeTransaction;

  if (!referenceId) throw new Error('Reference Id is required');
  if (!walletAddress) throw new Error('Wallet address is required');

  const url = `https://tmbtem7z94.execute-api.ap-southeast-1.amazonaws.com/develop/transaction/${referenceId}/sell/dispute`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
      walletAddress,
    },
  });

  const disputedTransaction = (await response.json()) as TransactionResponse;

  if (!response.ok) {
    throw new Error(
      disputedTransaction?.message || `Failed to dispute transaction`
    );
  }

  return true;
}

function useDisputeTransaction(props: Props) {
  return useQuery({
    queryKey: [props],
    queryFn: async () => disputeTransaction(props),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useDisputeTransaction;
