import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  XMarkIcon,
  MinusIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/20/solid';
import { useDebounce } from 'use-debounce';
import { Address, useNetwork } from 'wagmi';

import { BankInfo } from '@/hooks/useOnboarding';
import { classNames, errorWithReason } from '@/utils';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { Token } from '@/constants/tokens';
import useTokens from '@/hooks/useTokens';
import fiatCurrencies, { Currency } from '@/constants/currency';
import { getCustomChainId } from '@/constants/chains';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';

import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';
import { MatchedIcon, MatchingIcon } from '../icons';
import ConfirmationModal from './ConfirmationModal';

interface Props {
  bankInfo?: BankInfo;
  walletAddress?: Address;
  connected: boolean;
  isConnecting: boolean;
  connectWallet(): void;
}

function SellTokens({
  bankInfo,
  walletAddress,
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
    isLoadingPairPrice,
    tokenBalance,
    computedBalance,
    computedPlatformFee,
    tokens,
    error: tokenError,
  } = useTokens({ type: 'SELL' });

  const [debouncedTokenAmount] = useDebounce(tokenAmount, 500);

  const {
    transfer,
    isLoading,
    error: transferError,
    isError,
    isSuccess,
    data: transferData,
    transferPreparation,
  } = useTokenTransfer({
    amount: debouncedTokenAmount ? debouncedTokenAmount : '0',
    contractAddress: selectedToken?.contractAddress,
    recipient: '0xDc1ACdb071490A6fd66f449Db98F977a8B60FfC6', // TODO(dennis): make dynamic
  });

  const isTransferError = useMemo(
    () =>
      !Boolean(bankInfo) ||
      Boolean(tokenError) ||
      Boolean(transferPreparation.error) ||
      Number(tokenAmount) <= 0,
    [bankInfo, tokenError, transferPreparation.error, tokenAmount]
  );

  const transaction = useMemo((): Transaction | undefined => {
    if (!selectedToken) return undefined;
    if (!selectedFiat) return undefined;
    if (!tokenAmount) return undefined;
    if (isTransferError) return undefined;

    return {
      order: {
        currency: selectedFiat.symbol,
      },
      payment: {
        currency: selectedToken.symbol,
        amount: Number(tokenAmount),
      },
    };
  }, [isTransferError, selectedFiat, selectedToken, tokenAmount]);

  const { chain } = useNetwork();

  const {
    findingPairStatus,
    setFindingPairStatus,
    refetch: createSellTransaction,
  } = useCreateTransaction({
    type: 'SELL',
    createTransaction: {
      transaction,
      walletAddress,
      bankInfo,
      customChainId: getCustomChainId(chain),
    },
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      if (!bankInfo) {
        setError('Provide your bank information to transact.');
        return;
      }

      createSellTransaction();
    },
    [bankInfo, createSellTransaction]
  );

  const transferFunds = useCallback(() => {
    if (!transfer) return;

    setIsConfirmModalOpen(true);
    transfer();
  }, [transfer]);

  useEffect(() => {
    if (!transferData) return;

    console.log(transferData.hash);
  }, [transferData]);

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
              value={tokenAmount}
              onChange={e => {
                tokenAmountHandler(e.target.value);
                setFindingPairStatus('idle');
              }}
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
              value={fiatAmount}
              onChange={e => {
                fiatAmountHandler(e.target.value);
                setFindingPairStatus('idle');
              }}
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
        <InlineErrorDisplay show={Boolean(tokenError)} error={tokenError} />

        {errorWithReason(transferPreparation.error) && (
          <InlineErrorDisplay show error={transferPreparation.error.reason} />
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
            type="button"
            disabled={isTransferError}
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
              type="button"
              disabled={
                findingPairStatus === 'findingPair' ||
                findingPairStatus === 'pairNotFound'
              }
              className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
            >
              {findingPairStatus === 'findingPair'
                ? 'Processing'
                : 'No pairs available'}
            </button>
          )}

        {connected && findingPairStatus === 'idle' && (
          <button
            type="submit"
            disabled={isTransferError}
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        close={() => {
          if (!isLoading) {
            setIsConfirmModalOpen(false);
          }
        }}
        transferDetails={{
          payAmount: tokenAmount,
          payCurrency: selectedToken.symbol,
          receiveAmount: fiatAmount,
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
