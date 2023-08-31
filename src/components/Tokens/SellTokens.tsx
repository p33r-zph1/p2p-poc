import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  XMarkIcon,
  MinusIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/20/solid';
import { useDebounce } from 'use-debounce';
import { Address } from 'wagmi';

import { BankInfo } from '@/hooks/useOnboarding';
import useSellTokens from '@/hooks/useSellTokens';
import { useTokenApprove } from '@/hooks/useERC20Token';
import { classNames, errorWithReason, onlyNumbers } from '@/utils';
import { parseUnits } from 'ethers/lib/utils.js';
import { getErrorMessage } from '@/utils/isError';
import { Token } from '@/constants/tokens';
import fiatCurrencies, { Currency } from '@/constants/currency';

import CurrencySelector from './CurrencySelector';
import { InlineErrorDisplay } from '../shared';
import { MatchedIcon, MatchingIcon } from '../icons';
import SellConfirmationModal from './SellConfirmationModal';
import useEscrow from '@/hooks/useGetEscrow';

interface Props {
  bankInfo: BankInfo | undefined;
  walletAddress: Address | undefined;
  connected: boolean;
  isConnecting: boolean;
  fallbackFiatCurrency: Currency;
  connectWallet(): void;
  setPair: Dispatch<
    SetStateAction<
      Partial<{
        token: Token;
        fiat: Currency;
      }>
    >
  >;
}

function SellTokens({
  bankInfo,
  walletAddress,
  connected,
  connectWallet,
  isConnecting,
  fallbackFiatCurrency,
  setPair,
}: Props) {
  const {
    // useToken
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
    refetchTokenBalance,
    computedPlatformFee,
    tokens,
    tokenError,

    // useEscrow
    escrowData,
    fetchEscrow,
    findingPairStatus,
    setFindingPairStatus,

    // useCreateTransaction
    createTransaction,
    createTransactionData,
    createTransactionSuccess,
    createTransactionError,
    isCreatingTransaction,

    // useConfirmTransaction
    // confirmTransaction,
    // confirmTransactionData,
    // confirmTransactionSuccess,
    // confirmTransactionError,
    // isConfirmingTransaction,

    // useDisputeTransaction
    // disputeTransaction,
    // disputeTransactionData,
    // disputeTransactionSuccess,
    // disputeTransactionError,
    // isDisputingTransaction,
  } = useSellTokens({ walletAddress, bankInfo });

  const [debouncedTokenAmount] = useDebounce(tokenAmount, 500);

  const {
    approve,
    isLoading: isTransferingToken,
    error: transferTokenError,
    isError: isTransferTokenError,
    isSuccess: isTransferTokenSuccess,
    data: transferTokenData,
    // approvePreparation,
  } = useTokenApprove({
    amount: debouncedTokenAmount ? debouncedTokenAmount : '0',
    tokenAddress: selectedToken?.contractAddress,
    tokenDecimals: selectedToken?.decimals,
    spenderAddress: escrowData?.sell,
  });

  const isTransferError = useMemo(
    () =>
      !Boolean(bankInfo) ||
      Boolean(tokenError) ||
      // Boolean(approvePreparation.error) ||
      Number(tokenAmount) <= 0 ||
      tokenBalance?.value.lt(parseUnits(onlyNumbers(tokenAmount || '0'), selectedToken?.decimals)), // converts tokenAmount to Wei for it to be compared to tokenBalance(BigNumber)
    [bankInfo, tokenError, tokenAmount, tokenBalance]
  );

  const approveFunds = useCallback(() => {
    if (!approve) return;

    setIsConfirmModalOpen(true);
    approve();
  }, [approve]);

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

      fetchEscrow();
    },
    [bankInfo, fetchEscrow]
  );

  // can be refactored
  useEffect(() => {
    if (isTransferTokenSuccess) {
      createTransaction();
    }
  }, [createTransaction, isTransferTokenSuccess]);

  useEffect(() => {
    if (!connected) return;

    let currency: Currency | undefined;

    if (bankInfo?.bankDetails.countryCode) {
      // refactor me sir!
      if (bankInfo.bankDetails.countryCode.toLowerCase() === 'ph') {
        currency = fiatCurrencies.find(c => c.id === 'php');
      }
      if (bankInfo.bankDetails.countryCode.toLowerCase() === 'sg') {
        currency = fiatCurrencies.find(c => c.id === 'sgd');
      }
    }

    if (currency) setSelectedFiat(currency);
  }, [bankInfo?.bankDetails.countryCode, connected, setSelectedFiat]);

  useEffect(() => {
    if (!bankInfo?.bankDetails) {
      setSelectedFiat(fallbackFiatCurrency);
    }
  }, [bankInfo?.bankDetails, fallbackFiatCurrency, setSelectedFiat]);

  useEffect(() => {
    setPair({ token: selectedToken, fiat: selectedFiat });
  }, [selectedFiat, selectedToken, setPair]);

  // remove this useEffect below if you want to show the confirm receipt modal
  useEffect(() => {
    if (
      createTransactionSuccess ||
      createTransactionError ||
      isTransferTokenError
    ) {
      setFindingPairStatus('idle');
      tokenAmountHandler('');
      setIsConfirmModalOpen(false);
    }
  }, [
    createTransactionSuccess,
    createTransactionError,
    isTransferTokenError,
    setFindingPairStatus,
    tokenAmountHandler,
  ]);

  // if (!bankInfo?.bankDetails) {
  //   return <InlineErrorDisplay show error="Payment details is required." />;
  // }

  if (!selectedToken) {
    return (
      <InlineErrorDisplay
        show
        error="Service currently not available, please try again later."
      />
    );
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
              disabled={
                findingPairStatus === 'findingPair' ||
                findingPairStatus === 'waitingForEscrow'
              }
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
                disabled={
                  findingPairStatus === 'findingPair' ||
                  findingPairStatus === 'waitingForEscrow'
                }
                onChange={token => {
                  setSelectedToken(token);
                  setFindingPairStatus('idle');
                }}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-8 w-0.5 bg-[#E7E9EB]" />

            <div className="space-y-6 py-6">
              <div className="flex items-center justify-between pl-14 pr-4 lg:pr-10">
                <div className="absolute left-6 -ml-px h-5 w-5 rounded-full bg-[#E7E9EB] p-1">
                  <XMarkIcon
                    className="h-full w-full text-sleep-200"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-sm font-semibold text-sleep-100">
                  {isLoadingPairPrice ? 'calculating...' : pairPrice}
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
              disabled={
                // findingPairStatus === 'findingPair' ||
                // findingPairStatus === 'waitingForEscrow'
                true
              }
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
                disabled={
                  true
                  // findingPairStatus === 'findingPair' ||
                  // findingPairStatus === 'waitingForEscrow'
                }
                hideChevron={true}
                onChange={fiat => {
                  setSelectedFiat(fiat);
                  setFindingPairStatus('idle');
                }}
              />
            </div>
          </div>
        </div>

        {tokenBalance?.value.lt(
          parseUnits(onlyNumbers(tokenAmount || '0'), selectedToken.decimals)
        ) && <InlineErrorDisplay show error="Insufficient funds" />}

        <InlineErrorDisplay show={Boolean(error)} error={error} />
        <InlineErrorDisplay show={Boolean(tokenError)} error={tokenError} />
        <InlineErrorDisplay
          show={Boolean(createTransactionError)}
          error={getErrorMessage(createTransactionError)}
        />
        {/* <InlineErrorDisplay
          show={Boolean(confirmTransactionError)}
          error={getErrorMessage(confirmTransactionError)}
        /> */}

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
            onClick={approveFunds}
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

      <SellConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          if (!isCreatingTransaction) {
            setFindingPairStatus('idle');
            tokenAmountHandler('');
            setIsConfirmModalOpen(false);
          }
        }}
        // closeable={isTransferTokenError || createTransactionSuccess}
        closeable={isTransferTokenError}
        transferDetails={{
          payAmount: tokenAmount,
          payCurrency: selectedToken.symbol,
          receiveAmount: createTransactionSuccess
            ? createTransactionData?.order?.amount.toString() || 'N/A'
            : undefined,
          receiveCurrency: createTransactionSuccess
            ? createTransactionData?.order?.currency.toString() || 'N/A'
            : undefined,
        }}
        isError={isTransferTokenError}
        error={
          errorWithReason(transferTokenError)
            ? transferTokenError.reason
            : 'Transaction failed with unknown error'
        }
        isTransfering={isCreatingTransaction}
        // transferSuccessful={createTransactionSuccess}
        transferSuccessful={false} // don't show confirm receipt modal step
        confirmReceipt={async () => {
          // always happy path - needs refactor
          // ignore below for now
          // await confirmTransaction();
          // setFindingPairStatus('idle');
          // tokenAmountHandler('');
          // setIsConfirmModalOpen(false);
        }}
        disputeTransaction={async () => {
          // ignore for now
          // always happy path - needs refactor
          // await disputeTransaction();
          // setFindingPairStatus('idle');
          // tokenAmountHandler('');
          // setIsConfirmModalOpen(false);
        }}
        isConfirmingOrDisputing={
          // isConfirmingTransaction || isDisputingTransaction
          false
        }
      />
    </>
  );
}

export default SellTokens;
