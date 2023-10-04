import { getTransactionsAPIRoute } from '@/lib/env';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Address } from 'wagmi';

interface Escrow {
  message: string;
  data: {
    sell: Address;
    buy: Address;
  };
  copyright: string;
}

interface Props {
  walletAddress: Address | undefined;
  customChainId: string | undefined;
}

type FindingPairStatus =
  | 'idle'
  | 'findingPair'
  | 'waitingForEscrow'
  | 'pairFound'
  | 'pairNotFound';

export async function getEscrow({ walletAddress, customChainId }: Props) {
  if (!walletAddress) throw new Error('Wallet address is required');
  if (!customChainId) throw new Error('Custom chain id is required');

  const url = `${getTransactionsAPIRoute()}/escrow`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
      chain: customChainId,
    },
  });
  const escrow = (await response.json()) as Escrow;

  if (!response.ok || !escrow.data) {
    throw new Error(`Could not retrieve escrow data`);
  }

  return escrow.data;
}

export function useFindPair(props: Props) {
  const [findingPairStatus, setFindingPairStatus] =
    useState<FindingPairStatus>('idle');

  const { isFetching, ...rest } = useQuery({
    queryKey: ['pair'],
    queryFn: async () => getEscrow(props),
    onSuccess() {
      // if (props.type === 'BUY') setFindingPairStatus('waitingForEscrow');
      // else setFindingPairStatus('pairFound');
      setFindingPairStatus('pairFound');
    },
    onError() {
      setFindingPairStatus('pairNotFound');
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (isFetching) setFindingPairStatus('findingPair');
  }, [isFetching]);

  useEffect(() => {
    if (findingPairStatus !== 'waitingForEscrow') return;

    const interval = setTimeout(() => {
      setFindingPairStatus('pairFound');
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [findingPairStatus]);

  return {
    ...rest,
    isFetching,
    findingPairStatus,
    setFindingPairStatus,
  };
}

export function useEscrow(props: Props) {
  return useQuery({
    queryKey: ['escrow'],
    queryFn: async () => getEscrow(props),
    enabled: false,
    retry: false,
  });
}
