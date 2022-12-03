import { useQuery } from '@tanstack/react-query';

import { getAPIRoute } from '@/lib/env';
import useMountedAccount from './useMountedAccount';

interface Payment {
  currency: string;
  amount: number;
}

interface Order {
  currency: string;
}

interface Details {
  onChainStatus: string;
  offChainStatus: string;
  type: 'buy' | 'sell';
  payment: Payment;
  order: Order;
}

export interface ITransaction {
  status:
    | 'matching'
    | 'buyer_found'
    | 'waiting_for_crypto_payment'
    | 'crypto_escrow_confirm'
    | 'seller_found'
    | 'waiting_for_escrow'
    | 'waiting_for_fiat_payment'
    | 'send_fiat_payment_proof'
    | 'success'
    | 'failed';
  details: Details;
}

interface Data {
  transactions: ITransaction[];
}

interface APIResponse {
  message: string;
  data: Data | null;
  copyright: string;
}

function useTransactions() {
  const { address } = useMountedAccount();

  return useQuery({
    queryKey: [address],
    queryFn: async () => {
      const response = await fetch(`${getAPIRoute()}/transactions`, {
        headers: { walletAddress: address as string },
      });

      const data = (await response.json()) as APIResponse;

      if (!response.ok || !data.data?.transactions) {
        throw new Error(data.message || 'Failed to retrieve transactions.');
      }

      return data.data.transactions;
    },
  });
}

export default useTransactions;
