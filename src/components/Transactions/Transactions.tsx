import { useQuery } from '@tanstack/react-query';

import useMountedAccount from '@/hooks/useMountedAccount';
import { InlineErrorDisplay } from '../shared';
import TransactionSkeleton from './TransactionSkeleton';
import Transaction from './Transation';
import { getAPIRoute } from '@/lib/env';
import { classNames } from '@/utils';
import { Transition } from '@headlessui/react';

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

function Transactions() {
  const { address } = useMountedAccount();

  const {
    data = [],
    error,
    isError,
    isLoading,
    isFetching,
    isSuccess,
  } = useQuery({
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

  return (
    <>
      <Transition
        show={isFetching}
        enter="transition-all duration-75"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
        className="fixed bottom-2 left-1/2 -translate-x-1/2 rounded-xl bg-brand px-4 py-3"
      >
        <p className="text-sm text-white">Retrieving transactions...</p>
      </Transition>

      <div className="rounded-xl bg-white">
        {isSuccess && !data.length && (
          <p className="text-center text-sleep-300">No transactions</p>
        )}

        {data.length > 0 && (
          <div className={classNames(isFetching ? 'animate-pulse' : '')}>
            {data.map((tx, idx) => (
              <Transaction
                key={`${tx.status}-${idx}`}
                transaction={tx}
                lastItem={idx === data.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Transactions;
