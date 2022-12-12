import { useMemo } from 'react';
import { Address, useNetwork } from 'wagmi';

import { onlyNumbers } from '@/utils';
import useTokens from '@/hooks/useTokens';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';
import { getCustomChainId } from '@/constants/chains';

import { BankInfo } from './useOnboarding';

interface Props {
  walletAddress: Address | undefined;
  bankInfo: BankInfo | undefined;
}

function useSellTokens({ walletAddress, bankInfo }: Props) {
  const { chain } = useNetwork();

  const {
    selectedToken,
    selectedFiat,
    tokenAmount,
    error: tokenError,
    ...restOfTokens
  } = useTokens({ type: 'SELL' });

  const transaction = useMemo((): Transaction | undefined => {
    if (tokenError) return undefined;
    if (!selectedToken) return undefined;
    if (!selectedFiat) return undefined;
    if (!tokenAmount || Number(tokenAmount) <= 0) return undefined;

    return {
      order: {
        currency: selectedFiat.symbol,
      },
      payment: {
        currency: selectedToken.symbol,
        amount: Number(onlyNumbers(tokenAmount)),
      },
    };
  }, [selectedFiat, selectedToken, tokenAmount, tokenError]);

  const {
    findingPairStatus,
    setFindingPairStatus,
    refetch: createTransaction,
    data: createTransactionData,
    isSuccess: createTransactionSuccess,
    error: createTransactionError,
    isFetching: isCreatingTransaction,
  } = useCreateTransaction({
    type: 'SELL',
    createTransaction: {
      transaction,
      walletAddress,
      bankInfo,
      customChainId: getCustomChainId(chain),
    },
  });

  return {
    // useToken
    selectedToken,
    selectedFiat,
    tokenAmount,
    tokenError,
    ...restOfTokens,

    // useCreateTransaction
    findingPairStatus,
    setFindingPairStatus,
    createTransaction,
    createTransactionData,
    createTransactionSuccess,
    createTransactionError,
    isCreatingTransaction,
  };
}

export default useSellTokens;
