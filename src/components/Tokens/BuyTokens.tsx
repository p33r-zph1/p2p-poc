import { FormEvent, useState } from 'react';
import { MinusIcon, XMarkIcon } from '@heroicons/react/20/solid';

import { PaymentDetails } from '@/pages';
import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';

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

function BuyTokens({ paymentDetails, connected, connectWallet }: Props) {
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!paymentDetails) {
      setError('Provide your payment details to transact.');
      return;
    }
  };

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
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector currencies={fiat} />
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
          />
          <div className="absolute inset-y-0 right-0 flex items-center border-l">
            <CurrencySelector currencies={tokens} />
          </div>
        </div>
      </div>

      <InlineErrorDisplay show={Boolean(error)} error={error} />

      {connected && (
        <button
          type="submit"
          disabled={!Boolean(paymentDetails)}
          className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
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
    </form>
  );
}

export default BuyTokens;
