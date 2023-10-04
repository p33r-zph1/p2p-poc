import { getTransactionsAPIRoute } from '@/lib/env';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

interface Payment {
  currency: string;
  amount: number;
}

interface Order {
  currency: string;
  amount: number;
}

interface TransactionHash {
  hash: string;
  url: string;
}

export interface ITransaction {
  // status:
  //   | 'matching'
  //   | 'buyer_found'
  //   | 'waiting_for_crypto_payment'
  //   | 'crypto_escrow_confirm'
  //   | 'seller_found'
  //   | 'waiting_for_escrow'
  //   | 'waiting_for_fiat_payment'
  //   | 'send_fiat_payment_proof'
  //   | 'success'
  //   | 'failed';
  // transactionStatus: string;
  chain: string;
  transactionHash: {
    withdraw?: TransactionHash;
    deposit?: TransactionHash;
    refund?: TransactionHash;
  };
  depositTransactionHash: string;
  onChainStatus: string;
  offChainStatus: string;
  referenceId: string;
  walletAddress: Address;
  type: 'buy' | 'sell';
  payment: Payment;
  order: Order;
  created: number;
  updated?: number;
  confirmed?: number;
}

interface TransactionsResponse {
  message: string;
  data: ITransaction[] | null;
  copyright: string;
}

interface Props {
  walletAddress: Address | undefined;
}

async function getTransactions({ walletAddress }: Props) {
  if (!walletAddress) throw new Error('Wallet address is required');

  const response = await fetch(`${getTransactionsAPIRoute()}/transactions`, {
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
      walletaddress: walletAddress,
    },
  });

  const data = (await response.json()) as TransactionsResponse;

  if (!response.ok || !Array.isArray(data.data)) {
    throw new Error(data?.message || 'Failed to retrieve transactions.');
  }

  return data.data;
}

function useTransactionList(props: Props) {
  return useQuery({
    queryKey: [props],
    queryFn: async () => getTransactions(props),
    enabled: Boolean(props?.walletAddress),
    refetchInterval: 5000, // 5 seconds
  });
}

export default useTransactionList;
