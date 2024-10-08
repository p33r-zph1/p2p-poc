import { getTransactionsAPIRoute } from '@/lib/env';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

import useTransactions from '@/hooks/useTransactionList';

import { ServiceType } from './useTokens';

interface TransactionResponse {
  message: string;
  data: null;
  copyright: string;
}

interface ConfirmTransaction {
  walletAddress: Address | undefined;
  referenceId: string | undefined;
}

type BuyConfirmTransaction = ConfirmTransaction & {
  base64Image: string | undefined;
};

interface Props {
  type: ServiceType;
  confirmTransaction: ConfirmTransaction | BuyConfirmTransaction;
}

// export async function confirmTransaction({ type, confirmTransaction }: Props) {
//   const { referenceId, walletAddress } = confirmTransaction;

//   let body: {} | null = null;

//   if (type === 'BUY') {
//     if (!('base64Image' in confirmTransaction)) {
//       throw new Error('Image is required');
//     }

//     body = { image: confirmTransaction.base64Image };
//   }

//   if (!referenceId) throw new Error('Reference Id is required');
//   if (!walletAddress) throw new Error('Wallet address is required');

// const url = `${getTransactionsAPIRoute()}/transaction/${referenceId}/${
//   type === 'BUY' ? 'sell/receipt' : 'buy/confirm'
// }`;
// const response = await fetch(url, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     walletAddress,
//   },
//   body: JSON.stringify(body),
// });

//   const confirmedTransaction = (await response.json()) as TransactionResponse;

//   if (!response.ok) {
//     throw new Error(
//       confirmedTransaction?.message ||
//         `Failed to create confirm ${type} transaction`
//     );
//   }

//   return true;
// }

export async function confirmTransaction({ type, confirmTransaction }: Props) {
  const { referenceId, walletAddress } = confirmTransaction;

  if (!referenceId) throw new Error('Reference Id is required');
  if (!walletAddress) throw new Error('Wallet address is required');

  const url = `${getTransactionsAPIRoute()}/transaction/${referenceId}/sell/confirm`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
      walletaddress: walletAddress,
    },
  });

  const confirmedTransaction = (await response.json()) as TransactionResponse;

  if (!response.ok) {
    throw new Error(
      confirmedTransaction?.message ||
        `Failed to create confirm ${type} transaction`
    );
  }

  return true;
}

function useConfirmTransaction(props: Props) {
  const { refetch } = useTransactions({
    walletAddress: props?.confirmTransaction?.walletAddress,
  });

  return useQuery({
    queryKey: [props],
    queryFn: async () => confirmTransaction(props),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess() {
      refetch();
    },
  });
}

export default useConfirmTransaction;
