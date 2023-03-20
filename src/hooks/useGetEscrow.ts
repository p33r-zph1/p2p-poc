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
}

type FindingPairStatus =
  | 'idle'
  | 'findingPair'
  | 'waitingForEscrow'
  | 'pairFound'
  | 'pairNotFound';

export async function getEscrow({ walletAddress }: Props) {
  const url =
    'https://tmbtem7z94.execute-api.ap-southeast-1.amazonaws.com/develop/escrow';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
    },
  });
  const escrow = (await response.json()) as Escrow;

  if (!response.ok || !escrow.data) {
    throw new Error(`Could not retrieve escrow data`);
  }

  return escrow.data;
}

function useEscrow(props: Props) {
  const [findingPairStatus, setFindingPairStatus] =
    useState<FindingPairStatus>('idle');

  const { isFetching, ...rest } = useQuery({
    queryKey: [],
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

export default useEscrow;
