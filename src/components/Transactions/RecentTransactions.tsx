import Link from 'next/link';
import { Address, useNetwork } from 'wagmi';

import Transactions from './Transactions';
import useTransactions from '@/hooks/useTransactionList';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useEscrowContract } from '@/hooks/useEscrowContract';
import useEscrow from '@/hooks/useGetEscrow';
import { getCustomChainId } from '@/constants/chains';

interface Props {
  walletAddress: Address | undefined;
  setHasError: Dispatch<SetStateAction<string | undefined>>;
}

function RecentTransactions({ walletAddress, setHasError }: Props) {
  const { data, isFetching } = useTransactions({ walletAddress });
  const { chain } = useNetwork();

  const referenceId = useRef<string>('');

  const { data: escrowData, refetch: fetchEscrow } = useEscrow({
    walletAddress,
    customChainId: getCustomChainId(chain),
  });

  const { refundAfterExpiry } = useEscrowContract({
    contractAddress: escrowData?.sell,
    referenceId: referenceId.current,
  });

  useEffect(() => {
    fetchEscrow();
  }, [fetchEscrow]);

  return (
    <div className="mt-5">
      <div className="px-2 md:px-5 lg:px-10">
        <h3 className="text-xl font-semibold text-body md:text-2xl">
          Recent transactions
        </h3>
        <div className="my-3 flex items-center justify-between">
          {/* {isFetching ? (
            <div className="h-2.5 w-12 animate-pulse rounded-full bg-gray-300"></div>
          ) : ( */}
          <p className="text-sm text-sleep-100">{data?.length} results</p>
          {/* )} */}
          <Link
            href="/transactions"
            className="text-sm text-brand hover:underline focus:underline focus:outline-none"
          >
            View all
          </Link>
        </div>
      </div>

      <Transactions
        walletAddress={walletAddress}
        setHasError={setHasError}
        refund={refId => {
          referenceId.current = refId;
          refundAfterExpiry?.();
        }}
        maxLimit={10}
      />
    </div>
  );
}

export default RecentTransactions;
