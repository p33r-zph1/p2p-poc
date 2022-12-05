import { FormEvent, useState } from 'react';
import {
  CurrencyDollarIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

import { PaymentDetails } from '@/pages';
import useTokens from '@/hooks/useTokens';
import { Token } from '@/constants/tokens';
import fiatCurrencies, { Currency } from '@/constants/currency';

import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';

interface Props {
  paymentDetails?: PaymentDetails;
  connected: boolean;
  isConnecting: boolean;
  connectWallet(): void;
}

function BuyTokens({
  paymentDetails,
  connected,
  connectWallet,
  isConnecting,
}: Props) {
  const {
    selectedToken,
    selectedFiat,
    setSelectedToken,
    setSelectedFiat,
    fiatAmount,
    tokenAmount,
    fiatAmountHandler,
    tokenAmountHandler,
    pairPrice,
    tokenBalance,
    computedBalance,
    computedPlatformFee,
    tokens,
    error: tokenError,
  } = useTokens({ type: 'BUY' });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!paymentDetails) {
      setError('Provide your payment details to transact.');
      return;
    }
  };

  if (!selectedToken) {
    return <InlineErrorDisplay show error="Service currently not available" />;
  }

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
            value={fiatAmount}
            onChange={e => fiatAmountHandler(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector<Currency>
              selected={selectedFiat}
              currencies={fiatCurrencies}
              onChange={setSelectedFiat}
            />
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
                {computedPlatformFee}
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
                {pairPrice ? pairPrice : 'calculating...'}
              </span>
              <span className="text-sm font-semibold text-sleep-200">
                Conversion rate
              </span>
            </div>

            {computedBalance && (
              <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
                <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                  <CurrencyDollarIcon
                    className="h-full w-full text-sleep-200"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-sm font-semibold text-sleep-100">
                  {computedBalance}
                </span>
                <span className="text-sm font-semibold text-sleep-200">
                  Balance
                </span>
              </div>
            )}
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
            value={tokenAmount}
            onChange={e => tokenAmountHandler(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector<Token>
              selected={selectedToken}
              currencies={tokens}
              onChange={setSelectedToken}
            />
          </div>
        </div>
      </div>

      <InlineErrorDisplay show={Boolean(error)} error={error} />
      <InlineErrorDisplay show={Boolean(tokenError)} error={tokenError} />

      {connected && (
        <button
          type="submit"
          disabled={
            !Boolean(paymentDetails) ||
            Boolean(tokenError) ||
            Number(tokenAmount) <= 0
          }
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
        >
          Confirm
        </button>
      )}

      {!connected && (
        <button
          type="button"
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
          disabled={isConnecting}
          onClick={connectWallet}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </form>
  );
}

export default BuyTokens;
