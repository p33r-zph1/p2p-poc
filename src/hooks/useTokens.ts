import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNumericFormat } from 'react-number-format';
import { useBalance, useNetwork } from 'wagmi';

import fiatCurrencies, { Currency } from '@/constants/currency';
import { fromChain, type Token } from '@/constants/tokens';
import { phMaxFiatTransfer, platformFee } from '@/constants/dapp';
import { onlyNumbers, truncateText } from '@/utils';

import useMountedAccount from './useMountedAccount';
import usePairPrice from './usePairPrice';

export type ServiceType = 'BUY' | 'SELL';
export type Fields = 'Token' | 'Fiat';

interface Props {
  type: ServiceType;
}

function useTokens({ type }: Props) {
  const { address } = useMountedAccount();
  const { chain } = useNetwork();

  const [editingField, setEditingField] = useState<Fields>();

  const [error, setError] = useState('');

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    fromChain(chain)[0]
  );
  const [selectedFiat, setSelectedFiat] = useState<Currency | undefined>(
    fiatCurrencies[0]
  );

  const [tokenAmount, setTokenAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');

  const {
    data: pairPrice,
    isLoading: isLoadingPairPrice,
    isError: pairPriceError,
  } = usePairPrice(selectedToken?.symbol, selectedFiat?.id);

  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    token: selectedToken?.contractAddress,
  });

  const { format } = useNumericFormat({
    thousandSeparator: ',',
    decimalScale: 2,
  });

  const tokenAmountHandler = useCallback(
    (value: string) => {
      const tokenNumberValue = onlyNumbers(value);

      setEditingField('Token');
      setTokenAmount(format(tokenNumberValue));

      if (!pairPrice) return;

      const fiatConversion = Number(tokenNumberValue) * pairPrice;
      const withFees = fiatConversion * platformFee.reversePercentage;
      setFiatAmount(withFees <= 0 ? '' : format(withFees.toString()));
    },
    [format, pairPrice]
  );

  const fiatAmountHandler = useCallback(
    (value: string) => {
      const fiatNumberValue = onlyNumbers(value);

      setEditingField('Fiat');
      setFiatAmount(format(fiatNumberValue));

      if (!pairPrice) return;

      const tokenConversion = Number(fiatNumberValue) / pairPrice;
      setTokenAmount(
        tokenConversion <= 0 ? '' : format(tokenConversion.toString())
      );
    },
    [format, pairPrice]
  );

  const tokens = useMemo(() => fromChain(chain), [chain]);

  const formattedPairPrice = useMemo(() => {
    if (pairPriceError) return 'Price oracle timeout';
    if (!pairPrice) return 'Conversion not available';
    if (!selectedToken) return 'No token available';
    if (!selectedFiat) return 'No fiat available';
    // if (!isLoadingPairPrice) return undefined;

    let price = 0;
    let currency = '-';

    if (type === 'BUY') {
      price = 1 / pairPrice;
      currency = selectedToken.symbol;
    }
    if (type === 'SELL') {
      price = pairPrice;
      currency = selectedFiat.symbol;
    }

    return truncateText(format(price.toString()), {
      startPos: 12,
      endingText: currency,
    });
  }, [pairPrice, selectedToken, selectedFiat, pairPriceError, type, format]);

  const computedBalance = useMemo(() => {
    if (!tokenBalance || !selectedToken) return undefined;

    let computedBal = tokenBalance.formatted;

    if (type === 'BUY') {
      computedBal = (
        Number(tokenBalance.formatted) + Number(onlyNumbers(tokenAmount))
      ).toString();
    }
    if (type === 'SELL') {
      computedBal = (
        Number(tokenBalance.formatted) - Number(onlyNumbers(tokenAmount))
      ).toString();
    }

    return truncateText(`${format(computedBal)}`, {
      startPos: 12,
      endingText: selectedToken.symbol,
    });
  }, [format, selectedToken, tokenAmount, tokenBalance, type]);

  const computedPlatformFee = useMemo(() => {
    const fee = `${platformFee.amount}%`;
    if (!tokenAmount || !selectedToken) return fee;

    const computedFee = (
      Number(onlyNumbers(tokenAmount)) * platformFee.percentage
    ).toString();

    return truncateText(`${fee} (${format(computedFee)}`, {
      startPos: 12,
      endingText: `${selectedToken.symbol})`,
    });
  }, [format, selectedToken, tokenAmount]);

  // effect for when the tokens array changed
  // caused by switching networks
  useEffect(() => {
    setSelectedToken(tokens[0]);
  }, [setSelectedToken, tokens]);

  // effect for checking errors for the fiat amount
  useEffect(() => {
    function checkFiatAmountError() {
      if (!selectedFiat) return;

      setError(
        Number(onlyNumbers(fiatAmount)) > phMaxFiatTransfer
          ? `Max conversion of ${phMaxFiatTransfer} ${selectedFiat.symbol}`
          : ''
      );
    }

    checkFiatAmountError();
  }, [selectedFiat, fiatAmount]);

  // effect for recalculating values when the selected token/fiat changed
  useEffect(() => {
    if (!formattedPairPrice) return;

    if (editingField === 'Token') {
      tokenAmountHandler(onlyNumbers(tokenAmount));
    }
    if (editingField === 'Fiat') {
      fiatAmountHandler(onlyNumbers(fiatAmount));
    }
  }, [
    editingField,
    fiatAmount,
    fiatAmountHandler,
    formattedPairPrice,
    tokenAmount,
    tokenAmountHandler,
  ]);

  return {
    selectedToken,
    selectedFiat,
    setSelectedToken,
    setSelectedFiat,
    fiatAmount,
    tokenAmount,
    fiatAmountHandler,
    tokenAmountHandler,
    pairPrice: formattedPairPrice,
    pairPriceError,
    isLoadingPairPrice,
    tokenBalance,
    computedBalance,
    computedPlatformFee,
    refetchTokenBalance,
    tokens,
    error,
  };
}

export default useTokens;
