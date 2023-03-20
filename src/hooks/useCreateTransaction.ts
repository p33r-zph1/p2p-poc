import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

import { BankInfo } from './useOnboarding';
import { ServiceType } from './useTokens';

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

  const url = `https://tmbtem7z94.execute-api.ap-southeast-1.amazonaws.com/develop/transaction/${
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
  return useQuery({
    queryKey: [props],
    queryFn: async () => createTransaction(props),

    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useCreateTransaction;
