import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  XMarkIcon,
  MinusIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/20/solid';
import { useDebounce } from 'use-debounce';
import { useBalance, useNetwork } from 'wagmi';

import { PaymentDetails } from '@/pages';
import {
  classNames,
  errorWithReason,
  onlyNumbers,
  truncateText,
} from '@/utils';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import useMountedAccount from '@/hooks/useMountedAccount';
import usePairPrice from '@/hooks/usePairPrice';
import { fromChain, Token } from '@/constants/tokens';
import fiatCurrencies, { Currency } from '@/constants/currency';
import { platformFee } from '@/constants/dapp';

import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';
import { MatchedIcon, MatchingIcon } from '../icons';
import ConfirmationModal from './ConfirmationModal';

interface Props {
  paymentDetails?: PaymentDetails;
  connected: boolean;
  isConnecting: boolean;
  connectWallet(): void;
}

type FindingPairStatus = 'idle' | 'findingPair' | 'pairFound' | 'pairNotFound';

function SellTokens({
  paymentDetails,
  connected,
  connectWallet,
  isConnecting,
}: Props) {
  const { address } = useMountedAccount();
  const { chain } = useNetwork();
  const tokens = useMemo(() => fromChain(chain), [chain]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState('');

  const [findingPairStatus, setFindingPairStatus] =
    useState<FindingPairStatus>('idle');

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    fromChain(chain)[0]
  );
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[0]);

  const [tokenAmount, setTokenAmount] = useState('');
  const [debouncedTokenAmount] = useDebounce(tokenAmount, 100);

  const [fiatAmount, setFiatAmount] = useState('');
  const [debouncedFiatAmount] = useDebounce(fiatAmount, 100);

  const {
    transfer,
    isLoading,
    error: transferError,
    preparationError,
    isError,
    isSuccess,
  } = useTokenTransfer({
    amount: tokenAmount ? tokenAmount : '0',
    contractAddress: selectedToken?.contractAddress,
    recipient: '0xDc1ACdb071490A6fd66f449Db98F977a8B60FfC6', // TODO(dennis): make dynamic
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    token: selectedToken?.contractAddress,
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

    setIsConfirmModalOpen(true);
    transfer();
  };

  useEffect(() => {
    setSelectedToken(tokens[0]);
  }, [tokens]);

  const { data: pairPrice, isLoading: isLoadingPairPrice } = usePairPrice(
    selectedToken?.id,
    selectedFiat.id
  );

  const tokenAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);

      setTokenAmount(onlyNums);

      if (!pairPrice) return;

      const conversion = Number(onlyNums) * pairPrice;
      setFiatAmount(conversion <= 0 ? '' : conversion.toString());
    },
    [pairPrice]
  );

  const fiatAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);

      setFiatAmount(onlyNums);

      if (!pairPrice) return;
      const conversion = Number(onlyNums) / pairPrice;
      setTokenAmount(conversion <= 0 ? '' : conversion.toString());
    },
    [pairPrice]
  );

  if (!selectedToken) {
    return <InlineErrorDisplay show error="Service currently not available" />;
  }

  return (
    <>
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
              <CurrencySelector<Token>
                selected={selectedToken}
                currencies={tokens}
                onChange={setSelectedToken}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-8 w-0.5 bg-[#E7E9EB]" />

            <div className="space-y-6 py-6">
              {tokenBalance && (
                <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
                  <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                    <CurrencyDollarIcon
                      className="h-full w-full text-sleep-200"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm font-semibold text-sleep-100">
                    {truncateText(
                      `${Number(tokenBalance.formatted) - Number(tokenAmount)}`,
                      {
                        startPos: 12,
                        endingText: selectedToken.symbol,
                      }
                    )}
                  </span>
                  <span className="text-sm font-semibold text-sleep-200">
                    Balance
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
                <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                  <XMarkIcon
                    className="h-full w-full text-sleep-200"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-sm font-semibold text-sleep-100">
                  {pairPrice
                    ? truncateText(`${pairPrice}`, {
                        startPos: 12,
                        endingText: selectedFiat.symbol,
                      })
                    : 'calculating...'}
                </span>
                <span className="text-sm font-semibold text-sleep-200">
                  Conversion rate
                </span>
              </div>

              <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
                <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                  <MinusIcon
                    className="h-full w-full text-sleep-200"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-sm font-semibold text-sleep-100">
                  {platformFee.amount}%{' '}
                  {tokenAmount
                    ? `(${(
                        Number(tokenAmount) * platformFee.percentage
                      ).toFixed(2)} ${selectedToken.symbol})`
                    : ''}
                </span>
                <span className="text-sm font-semibold text-sleep-200">
                  Platform fee
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
              disabled={!pairPrice || isLoadingPairPrice}
              value={debouncedFiatAmount}
              onChange={fiatAmountHandler}
            />
            <div className="absolute inset-y-0 right-0 flex items-center border-l">
              <CurrencySelector<Currency>
                selected={selectedFiat}
                currencies={fiatCurrencies}
                onChange={setSelectedFiat}
              />
            </div>
          </div>
        </div>

        <InlineErrorDisplay show={Boolean(error)} error={error} />

        {errorWithReason(preparationError) && (
          <InlineErrorDisplay show error={preparationError.reason} />
        )}

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
              {findingPairStatus === 'findingPair' &&
                'Matching you with a buyer'}
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
              {findingPairStatus === 'pairNotFound' &&
                'Please try again later.'}
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
            disabled={
              !Boolean(paymentDetails) ||
              Boolean(preparationError) ||
              Number(tokenAmount) <= 0
            }
            className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
            onClick={findPair}
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        close={() => {
          if (!isLoading) {
            setIsConfirmModalOpen(false);
          }
        }}
        transferDetails={{
          payAmount: debouncedTokenAmount,
          payCurrency: selectedToken.symbol,
          receiveAmount: debouncedFiatAmount,
          receiveCurrency: selectedFiat.symbol,
        }}
        transferSuccessful={isSuccess}
        showError={isError}
        transfering={isLoading}
        // TODO(Dennis, Karim): improve error handling
        error={
          transferError
            ? // @ts-ignore
              transferError.reason || 'Tranasaction failed'
            : ''
        }
      />
    </>
  );
}

export default SellTokens;
