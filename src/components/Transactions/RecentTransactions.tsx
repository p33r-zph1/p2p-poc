import Link from 'next/link';
import { Address } from 'wagmi';

import Transactions from './Transactions';
import useTransactions from '@/hooks/useTransactionList';

interface Props {
  walletAddress: Address | undefined;
}

function RecentTransactions({ walletAddress }: Props) {
  const { data, isFetching } = useTransactions({ walletAddress });

  return (
    <div className="mt-5">
      <div className="px-2 md:px-5 lg:px-10">
        <h3 className="text-xl font-semibold text-body md:text-2xl">
          Recent transactions
        </h3>
        <div className="my-3 flex items-center justify-between">
          {isFetching ? (
            <div className="h-2.5 w-12 animate-pulse rounded-full bg-gray-300"></div>
          ) : (
            <p className="text-sm text-sleep-100">{data?.length} results</p>
          )}
          <Link
            href="/transactions"
            className="text-sm text-brand hover:underline focus:underline focus:outline-none"
          >
            View all
          </Link>
        </div>
      </div>

      <Transactions walletAddress={walletAddress} />
    </div>
  );
}

export default RecentTransactions;
