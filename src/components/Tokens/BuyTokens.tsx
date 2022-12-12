import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CurrencyDollarIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Address, useNetwork } from 'wagmi';

import { BankInfo } from '@/hooks/useOnboarding';
import { classNames, onlyNumbers } from '@/utils';
import useTokens from '@/hooks/useTokens';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';
import useConfirmTransaction from '@/hooks/useConfirmTransaction';
import { Token } from '@/constants/tokens';
import fiatCurrencies, { Currency } from '@/constants/currency';
import { getCustomChainId } from '@/constants/chains';

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
  setPair: Dispatch<
    SetStateAction<
      Partial<{
        token: Token;
        fiat: Currency;
      }>
    >
  >;
}

function BuyTokens({
  bankInfo,
  walletAddress,
  connected,
  connectWallet,
  isConnecting,
  setPair,
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

  const isTransferError = useMemo(
    () => !Boolean(bankInfo) || Boolean(tokenError) || Number(fiatAmount) <= 0,
    [bankInfo, tokenError, fiatAmount]
  );

  const transaction = useMemo((): Transaction | undefined => {
    if (!selectedToken) return undefined;
    if (!selectedFiat) return undefined;
    if (!tokenAmount) return undefined;
    if (isTransferError) return undefined;

    return {
      order: {
        currency: selectedToken.symbol,
      },
      payment: {
        currency: selectedFiat.symbol,
        amount: Number(onlyNumbers(fiatAmount)),
      },
    };
  }, [fiatAmount, isTransferError, selectedFiat, selectedToken, tokenAmount]);

  const { chain } = useNetwork();

  const {
    findingPairStatus,
    setFindingPairStatus,
    refetch: createBuyTransaction,
    data: buyTransaction,
  } = useCreateTransaction({
    type: 'BUY',
    createTransaction: {
      transaction,
      walletAddress,
      bankInfo,
      customChainId: getCustomChainId(chain),
    },
  });

  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();

  const {
    refetch: confirmBuyTransaction,
    isFetching: isFetchingBuyTransaction,
  } = useConfirmTransaction({
    type: 'BUY',
    confirmTransaction: {
      walletAddress,
      referenceId: buyTransaction?.referenceId,
      base64Image: imagePreview,
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

      createBuyTransaction();
    },
    [bankInfo, createBuyTransaction]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(undefined);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        setError('');

        const result = reader.result;
        if (typeof result !== 'string') throw {};

        confirmBuyTransaction();
        setIsConfirmModalOpen(true);
        setImagePreview(result);
      } catch (error) {
        setError('Failed to read the image');
        setImagePreview(undefined);
        console.error({ error });
      }
    };

    reader.readAsDataURL(imageFile);
  }, [confirmBuyTransaction, imageFile]);

  useEffect(() => {
    setPair({ token: selectedToken, fiat: selectedFiat });
  }, [selectedFiat, selectedToken, setPair]);

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
              disabled={
                findingPairStatus === 'findingPair' ||
                findingPairStatus === 'waitingForEscrow'
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
                  findingPairStatus === 'findingPair' ||
                  findingPairStatus === 'waitingForEscrow'
                }
                onChange={fiat => {
                  setSelectedFiat(fiat);
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
        </div>

        <InlineErrorDisplay show={Boolean(error)} error={error} />
        <InlineErrorDisplay show={Boolean(tokenError)} error={tokenError} />

        {connected && findingPairStatus !== 'idle' && (
          <div className="flex flex-col items-center justify-center">
            {(findingPairStatus === 'findingPair' ||
              findingPairStatus === 'pairNotFound') && (
              <MatchingIcon className="text-white" />
            )}

            {(findingPairStatus === 'pairFound' ||
              findingPairStatus === 'waitingForEscrow') && (
              <MatchedIcon className="text-white" />
            )}

            <p className="mt-4 text-xl font-semibold">
              {findingPairStatus === 'findingPair' &&
                'Matching you with a seller'}
              {findingPairStatus === 'waitingForEscrow' &&
                'Seller sending crypto'}
              {findingPairStatus === 'pairFound' && 'Escrow received crypto!'}
              {findingPairStatus === 'pairNotFound' && 'Could not find Seller'}
            </p>
            <p
              className={classNames(
                findingPairStatus === 'findingPair' ||
                  findingPairStatus === 'waitingForEscrow'
                  ? 'animate-pulse'
                  : '',
                'text-sm text-sleep-100'
              )}
            >
              {findingPairStatus === 'findingPair' &&
                ' This may take a few minutes...'}
              {findingPairStatus === 'waitingForEscrow' &&
                'Waiting for escrow to receive crypto '}
              {findingPairStatus === 'pairFound' &&
                'Crypto received - You can proceed to send FIAT to following Bank Account XXX"'}
              {findingPairStatus === 'pairNotFound' &&
                'Please try again later.'}
            </p>
          </div>
        )}

        {connected && findingPairStatus === 'pairFound' && (
          <button
            type="button"
            disabled={isTransferError}
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
          >
            Confirm Payment via Screenshot
          </button>
        )}

        {connected &&
          findingPairStatus !== 'idle' &&
          findingPairStatus !== 'pairFound' && (
            <button
              type="button"
              disabled={
                findingPairStatus === 'findingPair' ||
                findingPairStatus === 'waitingForEscrow' ||
                findingPairStatus === 'pairNotFound'
              }
              className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
            >
              {findingPairStatus === 'findingPair' ||
              findingPairStatus === 'waitingForEscrow'
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

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={event => {
          const file = event.target.files?.[0];
          if (file && file.type.substring(0, 5) === 'image') setImageFile(file);
          else setImageFile(undefined);

          // this line right below will reset the
          // input field so if you removed it you can re-add the same file
          event.target.value = '';
        }}
      />

      <ConfirmationModal
        type="BUY"
        isOpen={isConfirmModalOpen}
        image={imagePreview}
        close={() => {
          if (!isFetchingBuyTransaction) {
            setIsConfirmModalOpen(false);
          }
        }}
        transferDetails={{
          payAmount: fiatAmount,
          payCurrency: selectedFiat.symbol,
          receiveAmount: tokenAmount,
          receiveCurrency: selectedToken.symbol,
        }}
        transferSuccessful={false}
        showError={false}
        transfering={isFetchingBuyTransaction}
        // TODO(Dennis, Karim): improve error handling
        error=""
      />
    </>
  );
}

export default BuyTokens;
