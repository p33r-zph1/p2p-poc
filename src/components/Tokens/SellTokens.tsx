import { FormEvent, useCallback, useState } from 'react';
import { XMarkIcon, MinusIcon } from '@heroicons/react/20/solid';
import { useDebounce } from 'use-debounce';

import { PaymentDetails } from '@/pages';
import { classNames, onlyNumbers } from '@/utils';
import useTokenTransfer from '@/hooks/useTokenTransfer';

import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';
import { MatchedIcon, MatchingIcon } from '../icons';

const tokens = [
  { name: 'ETH', icon: '/images/ethereum.svg' },
  { name: 'MATIC', icon: '/images/polygon.svg' },
  { name: 'BNB', icon: '/images/bnb.svg' },
];

const fiat = [
  { name: 'USD', icon: '/images/ethereum.svg' },
  { name: 'PHP', icon: '/images/polygon.svg' },
];

interface Props {
  paymentDetails?: PaymentDetails;
  connected: boolean;
  connectWallet(): void;
}

type FindingPairStatus = 'idle' | 'findingPair' | 'pairFound' | 'pairNotFound';

function SellTokens({ paymentDetails, connected, connectWallet }: Props) {
  const [error, setError] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [debouncedTokenAmount] = useDebounce(tokenAmount, 100);
  const [findingPairStatus, setFindingPairStatus] =
    useState<FindingPairStatus>('idle');

  const [fiatAmount, setFiatAmount] = useState('');
  const [debouncedFiatAmount] = useDebounce(fiatAmount, 100);

  const { transfer } = useTokenTransfer({
    amount: tokenAmount ? tokenAmount : '0',
    contractAddress: '0xa2Fe6F40289ab5f017e8224fF7abD85C75E6DD34', // TODO(dennis): make dynamic
    recipient: '0x89B82794DbEDfc0DA33B5A824f07f39eC6aCCe34', // TODO(dennis): make dynamic
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!paymentDetails) {
      setError('Provide your payment details to transact.');
      return;
    }
  };

  const findPair = () => {
    setFindingPairStatus('findingPair');

    setTimeout(() => {
      setFindingPairStatus('pairFound');
    }, 2000);
  };

  const transferFunds = () => {
    if (!transfer) return;

    transfer();
  };

  const tokenAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);
      setTokenAmount(onlyNums);
    },
    []
  );

  const fiatAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);
      setFiatAmount(onlyNums);
    },
    []
  );

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div>
        <div className="relative">
          <label className="absolute top-3 left-8 text-sm text-sleep-200">
            You pay
          </label>
          <input
            type="text"
            className="w-full rounded-full border-brand pl-8 pt-7 pb-3 pr-36 text-lg"
            placeholder="0.00"
            value={debouncedTokenAmount}
            onChange={tokenAmountHandler}
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector currencies={tokens} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-8 w-0.5 bg-[#E7E9EB]" />

          <div className="space-y-6 py-6">
            <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
              <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                <MinusIcon
                  className="h-full w-full text-sleep-200"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm font-semibold text-sleep-100">
                3.2 ETH
              </span>
              <span className="text-sm font-semibold text-sleep-200">
                Platform fee
              </span>
            </div>

            <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
              <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                <XMarkIcon
                  className="h-full w-full text-sleep-200"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm font-semibold text-sleep-100">
                1,184.89 USD
              </span>
              <span className="text-sm font-semibold text-sleep-200">
                Conversion rate
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="absolute top-3 left-8 text-sm text-sleep-200">
            {"You'll receive roughly"}
          </label>
          <input
            type="text"
            className="w-full rounded-full border-brand pl-8 pt-7 pb-3 pr-36 text-lg"
            placeholder="0.00"
            value={debouncedFiatAmount}
            onChange={fiatAmountHandler}
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector currencies={fiat} />
          </div>
        </div>
      </div>

      <InlineErrorDisplay show={Boolean(error)} error={error} />

      {connected && findingPairStatus !== 'idle' && (
        <div className="flex flex-col items-center justify-center">
          {(findingPairStatus === 'findingPair' ||
            findingPairStatus === 'pairNotFound') && (
            <MatchingIcon className="text-white" />
          )}

          {findingPairStatus === 'pairFound' && (
            <MatchedIcon className="text-white" />
          )}

          <p className="mt-4 text-xl font-semibold">
            {findingPairStatus === 'findingPair' && 'Matching you with a buyer'}
            {findingPairStatus === 'pairFound' && 'Buyer found!'}
            {findingPairStatus === 'pairNotFound' && 'Could not find Buyer.'}
          </p>
          <p
            className={classNames(
              findingPairStatus === 'findingPair' ? 'animate-pulse' : '',
              'text-sm text-sleep-100'
            )}
          >
            {findingPairStatus === 'findingPair' &&
              ' This may take a few minutes...'}
            {findingPairStatus === 'pairFound' &&
              'Send crypto to our secure escrow account'}
            {findingPairStatus === 'pairNotFound' && 'Please try again later.'}
          </p>
        </div>
      )}

      {connected && findingPairStatus === 'pairFound' && (
        <button
          type="submit"
          onClick={transferFunds}
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
        >
          Send Crypto
        </button>
      )}

      {connected &&
        findingPairStatus !== 'idle' &&
        findingPairStatus !== 'pairFound' && (
          <button
            type="submit"
            disabled={findingPairStatus === 'findingPair'}
            className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
          >
            Processing
          </button>
        )}

      {connected && findingPairStatus === 'idle' && (
        <button
          type="submit"
          disabled={!Boolean(paymentDetails)}
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
          onClick={findPair}
        >
          Confirm
        </button>
      )}

      {!connected && (
        <button
          type="button"
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {/* TODO(dennis): display insufficient funds if token balance is not enough */}
    </form>
  );
}

export default SellTokens;
