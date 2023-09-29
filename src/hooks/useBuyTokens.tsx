import { useEffect, useMemo, useState } from 'react';
import { Address, useNetwork } from 'wagmi';

import { onlyNumbers } from '@/utils';
import useTokens from '@/hooks/useTokens';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';
import useConfirmTransaction from '@/hooks/useConfirmTransaction';
import { getCustomChainId } from '@/constants/chains';

import { BankInfo } from './useOnboarding';
import { useFindPair } from './useGetEscrow';

interface Props {
  walletAddress: Address | undefined;
  bankInfo: BankInfo | undefined;
}

function useBuyTokens({ walletAddress, bankInfo }: Props) {
  const { chain } = useNetwork();
  const [paymentImage, setPaymentImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [ImageError, setImageError] = useState('');

  const {
    selectedToken,
    selectedFiat,
    fiatAmount,
    tokenAmount,
    error: tokenError,
    ...restOfTokens
  } = useTokens({ type: 'BUY' });

  const transaction = useMemo((): Transaction | undefined => {
    if (tokenError) return undefined;
    if (!selectedToken) return undefined;
    if (!selectedFiat) return undefined;
    if (!tokenAmount || Number(tokenAmount) <= 0) return undefined;

    return {
      order: {
        currency: selectedToken.symbol,
      },
      payment: {
        currency: selectedFiat.symbol,
        amount: Number(onlyNumbers(fiatAmount)),
      },
    };
  }, [fiatAmount, selectedFiat, selectedToken, tokenAmount, tokenError]);

  const {
    data: escrowData,
    refetch: findPair,
    findingPairStatus,
    setFindingPairStatus,
  } = useFindPair({
    walletAddress,
    customChainId: getCustomChainId(chain),
  });

  const {
    refetch: createTransaction,
    data: createTransactionData,
    isSuccess: createTransactionSuccess,
    error: createTransactionError,
    isFetching: isCreatingTransaction,
  } = useCreateTransaction({
    type: 'BUY',
    createTransaction: {
      transaction,
      walletAddress,
      bankInfo,
      customChainId: getCustomChainId(chain),
    },
  });

  const {
    refetch: confirmTransaction,
    data: confirmTransactionData,
    isSuccess: confirmTransactionSuccess,
    error: confirmTransactionError,
    isFetching: isConfirmingTransaction,
  } = useConfirmTransaction({
    type: 'BUY',
    confirmTransaction: {
      walletAddress,
      referenceId: createTransactionData?.referenceId,
      base64Image: imagePreview,
    },
  });

  useEffect(() => {
    if (!paymentImage) {
      setImagePreview(undefined);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        setImageError('');

        const result = reader.result;
        if (typeof result !== 'string') throw {};

        setImagePreview(result);
      } catch (error) {
        setImageError('Failed to read the image');
        setImagePreview(undefined);
        console.error({ error });
      }
    };

    reader.readAsDataURL(paymentImage);
  }, [paymentImage]);

  return {
    // useToken
    selectedToken,
    selectedFiat,
    fiatAmount,
    tokenAmount,
    tokenError,
    ...restOfTokens,

    // useEscrow
    escrowData,
    findPair,
    findingPairStatus,
    setFindingPairStatus,

    // useCreateTransaction
    createTransaction,
    createTransactionData,
    createTransactionSuccess,
    createTransactionError,
    isCreatingTransaction,

    // confirmTransaction
    confirmTransaction,
    confirmTransactionData,
    confirmTransactionSuccess,
    confirmTransactionError,
    isConfirmingTransaction,

    // payment image
    setPaymentImage,
    imagePreview,
    ImageError,
  };
}

export default useBuyTokens;
