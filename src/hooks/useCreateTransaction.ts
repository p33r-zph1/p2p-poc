import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

import useTransactions from '@/hooks/useTransactionList';

import { BankInfo } from './useOnboarding';
import { ServiceType } from './useTokens';
import { getTransactionsAPIRoute } from '@/lib/env';

interface Payment {
  currency: string;
  amount: number;
}

interface Order {
  currency: string;
  amount: number;
}

export interface Transaction {
  payment: Payment;
  order: Order;
}

interface Data {
  referenceId: string;
  created: number;
  onChainStatus: string;
  offChainStatus: string;
  payment: Order;
  order: Order;
  transactionStatus: string;
  type: string;
  chain: string;
  walletAddress: string;
  depositTransactionHash: string;
  txHash: string;
}

interface TransactionResponse {
  message: string;
  data: Data;
  copyright: string;
}

interface CreateTransaction {
  transaction: Transaction | undefined;
  walletAddress: Address | undefined;
  bankInfo: BankInfo | undefined;
  customChainId: string | undefined;
}

interface Props {
  type: ServiceType;
  createTransaction: CreateTransaction;
}

export async function createTransaction({ type, createTransaction }: Props) {
  const { bankInfo, customChainId, transaction, walletAddress } =
    createTransaction;

  if (!bankInfo) throw new Error('Bank information is required');
  if (!customChainId) throw new Error('Custom chain id is required');
  if (!transaction) throw new Error('Transaction is required');
  if (!walletAddress) throw new Error('Wallet address is required');

  const url = `${getTransactionsAPIRoute()}/transaction/${
    type === 'BUY' ? 'buy' : 'sell'
  }`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${walletAddress}`,
      country: bankInfo.bankDetails.countryCode,
      chain: customChainId,
      walletaddress: walletAddress,
    },
    body: JSON.stringify(transaction),
  });

  const createdTransaction = (await response.json()) as TransactionResponse;

  if (!response.ok || !createdTransaction.data?.referenceId) {
    throw new Error(
      createdTransaction?.message || `Failed to create ${type} transaction`
    );
  }

  return createdTransaction.data;
}

function useCreateTransaction(props: Props) {
  const { refetch } = useTransactions({
    walletAddress: props?.createTransaction?.walletAddress,
  });

  return useQuery({
    queryKey: [props],
    queryFn: async () => createTransaction(props),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess() {
      refetch();
    },
  });
}

export default useCreateTransaction;
