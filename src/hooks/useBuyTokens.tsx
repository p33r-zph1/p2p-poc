import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, useNetwork } from 'wagmi';

import { onlyNumbers } from '@/utils';
import useTokens from '@/hooks/useTokens';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';
import useConfirmTransaction from '@/hooks/useConfirmTransaction';
import { getCustomChainId } from '@/constants/chains';
import { BankInfo } from './useOnboarding';

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
    findingPairStatus,
    setFindingPairStatus,
    refetch: createBuyTransaction,
    isFetching: isCreatingTransaction,
    data: buyCreateTransaction,
    isSuccess: buyCreateTransactionSuccess,
    error: createTransactionError,
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
    refetch: confirmBuyTransaction,
    isFetching: isConfirmingBuyTransaction,
    isSuccess: confirmBuyTransactionSuccess,
    error: confirmBuyError,
  } = useConfirmTransaction({
    type: 'BUY',
    confirmTransaction: {
      walletAddress,
      referenceId: buyCreateTransaction?.referenceId,
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

    // useCreateTransaction
    findingPairStatus,
    setFindingPairStatus,
    isCreatingTransaction,
    createBuyTransaction,
    buyCreateTransactionSuccess,
    createTransactionError,

    // confirmTransaction
    isConfirmingBuyTransaction,
    confirmBuyTransaction,
    confirmBuyTransactionSuccess,
    confirmBuyError,

    // payment image
    setPaymentImage,
    imagePreview,
    ImageError,
  };
}

export default useBuyTokens;
