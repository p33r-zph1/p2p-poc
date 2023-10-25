import { MouseEventHandler, useMemo, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { ITransaction } from '@/hooks/useTransactionList';
import { classNames } from '@/utils';
import SuccessfulTransactionModal from './SuccessfulTransactionModal';
import { isDateGreaterThanOrEqualOneDay } from '@/utils/date';
import { useEscrowContract } from '@/hooks/useEscrowContract';
import { Address, useNetwork } from 'wagmi';
import { getFirstSentence } from '@/utils/isError';

interface Props {
  transaction: ITransaction;
  refundContractAddress: Address | undefined;
  lastItem?: boolean;
}

interface StatusBadgeProps {
  offChainStatus: ITransaction['offChainStatus'];
  onChainStatus: ITransaction['onChainStatus'];
  onConfirmReciept: MouseEventHandler<HTMLButtonElement>;
  refundable: boolean;
}

function StatusBadge({
  offChainStatus,
  onChainStatus,
  onConfirmReciept,
  refundable,
}: StatusBadgeProps) {
  // if (status === 'crypto_escrow_confirm') {
  //   return (
  //     <>
  //       <button
  //         className="hidden rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300 md:block"
  //         onClick={onConfirmReciept}
  //       >
  //         Please confirm Fiat receipt
  //       </button>

  //       <button
  //         className="rounded-2xl bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300 md:hidden"
  //         onClick={onConfirmReciept}
  //       >
  //         Confirm receipt
  //       </button>
  //     </>
  //   );
  // }

  // if (status === 'matching') {
  //   return (
  //     <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
  //       <p className="text-sm text-[#4FA355]">Pending</p>
  //     </div>
  //   );
  // }

  // if (status === 'success') {
  //   return (
  //     <div className="rounded-full bg-[#FFF6E6] px-4 py-2 font-bold">
  //       <p className="text-sm text-[#FFAD0D]">Successful</p>
  //     </div>
  //   );
  // }

  // if (status === 'failed') {
  //   return (
  //     <div className="rounded-full bg-[#FAEBEB] px-4 py-2 font-bold">
  //       <p className="text-sm text-[#D74E47]">Failed</p>
  //     </div>
  //   );
  // }

  if (offChainStatus === 'success' && onChainStatus === 'success') {
    return (
      <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
        <p className="text-sm text-[#4FA355]">Successful</p>
      </div>
    );
  }

  if (onChainStatus === 'refunded') {
    return (
      <div className="rounded-full bg-[#EBFAF0] px-4 py-2 font-bold">
        <p className="text-sm text-[#4FA355]">Refunded</p>
      </div>
    );
  }

  if (offChainStatus === 'failed' || onChainStatus === 'failed') {
    return (
      <div className="rounded-full bg-[#FAEBEB] px-4 py-2 font-bold">
        <p className="text-sm text-[#D74E47]">Failed</p>
      </div>
    );
  }

  return (
    <div className="rounded-full bg-[#FFF6E6] px-4 py-2 font-bold">
      <p className="text-sm text-[#FFAD0D]">
        Pending{' '}
        {refundable && (
          <span className="text-xs text-[#FFAD0D]">(refundable)</span>
        )}
      </p>
    </div>
  );
}

function Transaction({
  transaction,
  refundContractAddress,
  lastItem = true,
}: Props) {
  const { chain: currentChain } = useNetwork();

  const [isOpen, setIsOpen] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  const {
    type,
    order,
    payment,
    referenceId,
    offChainStatus,
    onChainStatus,
    chain,
    transactionHash,
    created,
    updated,
    confirmed,
  } = transaction;

  const refundable = useMemo(() => {
    if (onChainStatus !== 'success') return false; // if on-chain is not successful
    if (offChainStatus !== 'pending') return false; // if off-chain is not pending

    if (Boolean(transactionHash?.refund)) return false; // if there's already a txn hash

    if (!created) return false; // if there's no created date

    const result = isDateGreaterThanOrEqualOneDay(new Date(created)); // if date is greaten than or equal to +1 day

    return result;
  }, [created, offChainStatus, onChainStatus, transactionHash?.refund]);

  const {
    refundAfterExpiry,
    error: refundError,
    isLoading,
    isSuccess: isRefundSubmitted,
  } = useEscrowContract({
    contractAddress: refundContractAddress,
    referenceId: referenceId,
    refundable: refundable && isDisclosureOpen,
  });

  const confirmReceipt: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();

    // TODO(Dennis): you can do the confirmation here

    setIsOpen(true);
  };

  const isOnSameChain = useMemo(
    () => chain === currentChain?.nativeCurrency.name,
    [chain, currentChain?.nativeCurrency.name]
  );

  // console.log({
  //   chainFromBe: chain,
  //   currentChainName: currentChain?.nativeCurrency.name,
  //   isOnSameChain,
  // });

  return (
    <div className={classNames(lastItem ? '' : 'border-b')}>
      <Disclosure>
        {({ open }) => {
          setIsDisclosureOpen(open);

          return (
            <div className="p-5">
              <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-brand focus-visible:ring-opacity-75">
                <div className="space-y-2">
                  <p className="text-xs font-semibold sm:text-sm md:text-lg">
                    {`${payment.amount} ${payment.currency} = ${order.amount} ${order.currency}`}
                  </p>
                  <p className="flex items-center space-x-2 text-sleep-100">
                    <span>{type === 'buy' ? 'Buy crypto' : 'Sell crypto'}</span>
                    <span
                      className="block h-1 w-1 rounded-full bg-sleep-100"
                      aria-hidden
                    />
                    <span>{new Date(created).toLocaleString('en')}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <StatusBadge
                    offChainStatus={offChainStatus}
                    onChainStatus={onChainStatus}
                    onConfirmReciept={confirmReceipt}
                    refundable={refundable}
                  />

                  <ChevronRightIcon
                    className={classNames(
                      open ? '-rotate-180 transform' : '',
                      ' h-5 w-5 text-purple-500'
                    )}
                  />
                </div>
              </Disclosure.Button>

              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="m-4"
              >
                <Disclosure.Panel className="p-1 text-gray-500">
                  Reference Id: {referenceId}
                </Disclosure.Panel>

                {/* <Disclosure.Panel className="p-1 text-gray-500">
                  Off chain status:{' '}
                  {onChainStatus === 'refunded' ? 'cancelled' : offChainStatus}
                </Disclosure.Panel>

                <Disclosure.Panel className="p-1 text-gray-500">
                  On chain status: {onChainStatus}
                </Disclosure.Panel> */}

                <Disclosure.Panel className="p-1 text-gray-500">
                  Chain: {chain}
                </Disclosure.Panel>

                {updated && (
                  <Disclosure.Panel className="p-1 text-gray-500">
                    Updated: {new Date(updated).toLocaleString('en')}
                  </Disclosure.Panel>
                )}
                {confirmed && (
                  <Disclosure.Panel className="p-1 text-gray-500">
                    Confirmed: {new Date(confirmed).toLocaleString('en')}
                  </Disclosure.Panel>
                )}
                {refundable && !isOnSameChain && (
                  <Disclosure.Panel className="p-1 text-gray-500">
                    Please switch to <b>{chain}</b> chain to enable refund.
                  </Disclosure.Panel>
                )}

                <Disclosure.Panel className="p-1">
                  {transactionHash?.deposit && (
                    <button
                      className="mr-2 rounded-4xl bg-cool px-4 py-1 text-sm font-bold text-white hover:bg-cool/90 focus:outline-none focus:ring focus:ring-cool/80 active:bg-cool/80 disabled:bg-sleep disabled:text-sleep-300"
                      onClick={() =>
                        window.open(transactionHash.deposit?.url, '_blank')
                      }
                    >
                      View on Block Explorer
                    </button>
                  )}

                  {refundable && (
                    <button
                      className="mr-2 rounded-4xl bg-notice px-4 py-1 text-sm font-bold text-white hover:bg-notice/90 focus:outline-none focus:ring focus:ring-notice/80 active:bg-notice/80 disabled:bg-sleep disabled:text-sleep-300"
                      onClick={refundAfterExpiry}
                      disabled={!isOnSameChain}
                    >
                      Refund
                    </button>
                  )}

                  {transactionHash?.refund && (
                    <button
                      className="mr-2 rounded-4xl bg-success px-4 py-1 text-sm font-bold text-white hover:bg-success/90 focus:outline-none focus:ring focus:ring-success/80 active:bg-success/80 disabled:bg-sleep disabled:text-sleep-300"
                      onClick={() =>
                        window.open(transactionHash.refund?.url, '_blank')
                      }
                    >
                      View Refund on Block Explorer
                    </button>
                  )}
                </Disclosure.Panel>

                {refundError?.message && (
                  <Disclosure.Panel className="text-xm p-1 font-bold text-mad">
                    {getFirstSentence(refundError.message)}
                  </Disclosure.Panel>
                )}

                {isRefundSubmitted && (
                  <Disclosure.Panel className="text-xm p-1 font-bold text-success">
                    Your refund request was sent!
                  </Disclosure.Panel>
                )}
              </Transition>
            </div>
          );
        }}
      </Disclosure>

      <SuccessfulTransactionModal
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        transaction={transaction}
      />
    </div>
  );
}

export default Transaction;
