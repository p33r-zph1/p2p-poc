import { useMemo } from 'react';
import { Address, useNetwork } from 'wagmi';

import { onlyNumbers } from '@/utils';
import useTokens from '@/hooks/useTokens';
import useCreateTransaction, {
  Transaction,
} from '@/hooks/useCreateTransaction';
import { getCustomChainId } from '@/constants/chains';

import { BankInfo } from './useOnboarding';
import useConfirmTransaction from './useConfirmTransaction';
import useEscrow from './useGetEscrow';
import useDisputeTransaction from './useDisputeTransaction';

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
    data: escrowData,
    refetch: fetchEscrow,
    findingPairStatus,
    setFindingPairStatus,
  } = useEscrow();

  const {
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

  const {
    refetch: confirmTransaction,
    data: confirmTransactionData,
    isSuccess: confirmTransactionSuccess,
    error: confirmTransactionError,
    isFetching: isConfirmingTransaction,
  } = useConfirmTransaction({
    type: 'SELL',
    confirmTransaction: {
      walletAddress,
      referenceId: createTransactionData?.referenceId,
    },
  });

  const {
    refetch: disputeTransaction,
    data: disputeTransactionData,
    isSuccess: disputeTransactionSuccess,
    error: disputeTransactionError,
    isFetching: isDisputingTransaction,
  } = useDisputeTransaction({
    // type: 'SELL',
    disputeTransaction: {
      walletAddress,
      referenceId: createTransactionData?.referenceId,
    },
  });

  return {
    // useToken
    selectedToken,
    selectedFiat,
    tokenAmount,
    tokenError,
    ...restOfTokens,

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
    confirmTransaction,
    confirmTransactionData,
    confirmTransactionSuccess,
    confirmTransactionError,
    isConfirmingTransaction,

    // useDisputeTransaction
    disputeTransaction,
    disputeTransactionData,
    disputeTransactionSuccess,
    disputeTransactionError,
    isDisputingTransaction,
  };
}

export default useSellTokens;
