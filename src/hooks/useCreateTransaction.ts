import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Address } from 'wagmi';

interface Payment {
  currency: string;
  amount: number;
}

interface Order {
  currency: string;
}

export interface Transaction {
  payment: Payment;
  order: Order;
}

interface Data {
  referenceId: string;
}

interface TransactionResponse {
  message: string;
  data: Data;
  copyright: string;
}

type FindingPairStatus = 'idle' | 'findingPair' | 'pairFound' | 'pairNotFound';

export async function createBuyTransaction(
  transaction: Transaction | undefined,
  walletAddress: Address | undefined
) {
  if (!transaction) {
    throw new Error('Transaction is required');
  }

  const url =
    'https://tmbtem7z94.execute-api.ap-southeast-1.amazonaws.com/develop/transaction/buy';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });

  const buyTransaction = (await response.json()) as TransactionResponse;

  if (!response.ok || !buyTransaction.data?.referenceId) {
    throw new Error('Transaction/Wallet address is required');
  }

  return buyTransaction.data;
}

export async function createSellTransaction(
  transaction: Transaction | undefined,
  walletAddress: Address | undefined
) {
  if (!transaction || !walletAddress) {
    throw new Error('Transaction/Wallet address is required');
  }

  const url =
    'https://tmbtem7z94.execute-api.ap-southeast-1.amazonaws.com/develop/transaction/sell';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      country: 'ph',
      chain: 'eth',
      walletAddress,
    },
    body: JSON.stringify(transaction),
  });

  const sellTransaction = (await response.json()) as TransactionResponse;

  if (!response.ok || !sellTransaction.data?.referenceId) {
    throw new Error(`Failed to create sell transaction`);
  }

  return sellTransaction.data;
}

export function useCreateBuyTransaction(
  transaction: Transaction,
  walletAddress: Address
) {
  return useQuery({
    queryKey: [transaction, walletAddress],
    queryFn: async () => createBuyTransaction(transaction, walletAddress),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateSellTransaction(
  transaction: Transaction | undefined,
  walletAddress: Address | undefined
) {
  const [findingPairStatus, setFindingPairStatus] =
    useState<FindingPairStatus>('idle');

  const { isFetching, ...rest } = useQuery({
    queryKey: [transaction, walletAddress],
    queryFn: async () => createSellTransaction(transaction, walletAddress),
    onSuccess() {
      setFindingPairStatus('pairFound');
    },
    onError() {
      setFindingPairStatus('pairNotFound');
    },
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isFetching) setFindingPairStatus('findingPair');
  }, [isFetching]);

  return {
    ...rest,
    isFetching,
    findingPairStatus,
    setFindingPairStatus,
  };
}
