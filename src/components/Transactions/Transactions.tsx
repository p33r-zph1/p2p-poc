import { Address } from 'wagmi';
import { Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getErrorMessage } from '@/utils/isError';

import { classNames } from '@/utils';
import useTransactions, { ITransaction } from '@/hooks/useTransactionList';

import { InlineErrorDisplay } from '../shared';
import TransactionSkeleton from './TransactionSkeleton';
import Transaction from './Transaction';

interface Props {
  walletAddress: Address | undefined;
  setHasError: Dispatch<SetStateAction<string | undefined>>;
  refundContractAddress: Address | undefined;
  maxLimit: 'all' | number;
}

function Transactions({
  walletAddress,
  setHasError,
  refundContractAddress,
  maxLimit,
}: Props) {
  const { data, error, isError, isLoading, isFetching, isSuccess } =
    useTransactions({ walletAddress });

  useEffect(() => {
    if (isError && isError) {
      setHasError(getErrorMessage(error));
    }
  }, [isError, error, setHasError]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl bg-white">
        {Array.from({ length: 10 }).map((_, idx) => (
          <TransactionSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <InlineErrorDisplay
        show={isError}
        error={
          error instanceof Error
            ? error.message
            : 'Failed to retrieve transactions.'
        }
      />
    );
  }

  const renderTransactions = (transactions: ITransaction[]) => {
    return transactions.map((tx, idx) => (
      <Transaction
        key={`${tx.created}-${idx}`}
        transaction={tx}
        refundContractAddress={refundContractAddress}
        lastItem={idx === transactions.length - 1}
      />
    ));
  };

  const displayedTransactions =
    typeof maxLimit === 'number' ? data.slice(0, maxLimit) : data;

  return (
    <>
      {/* <Transition
        show={isFetching}
        enter="transition-all duration-75"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
        className="fixed bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-brand px-4 py-3"
      >
        <p className="text-sm text-white">Retrieving transactions...</p>
      </Transition> */}

      <div className="rounded-xl bg-white">
        {isSuccess && !data.length && (
          <p className="p-[50px] text-center text-sleep-300">No transactions</p>
        )}

        {data.length > 0 && (
          <div className={classNames(isFetching ? '' : '')}>
            {renderTransactions(displayedTransactions)}
          </div>
        )}
      </div>
    </>
  );
}

export default Transactions;
