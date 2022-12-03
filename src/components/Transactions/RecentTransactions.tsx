import Link from 'next/link';

import Transactions from './Transactions';

function RecentTransactions() {
  return (
    <div className="mt-5 md:mt-0 md:px-5 lg:px-10">
      <h3 className="text-xl font-semibold text-body md:text-2xl">
        Recent transactions
      </h3>
      <div className="my-3 flex items-center justify-between">
        <p className="text-sm text-sleep-100">4 results</p>
        <Link
          href="/transactions"
          className="text-sm text-brand hover:underline focus:underline focus:outline-none"
        >
          Sell all
        </Link>
      </div>

      <Transactions />
    </div>
  );
}

export default RecentTransactions;
