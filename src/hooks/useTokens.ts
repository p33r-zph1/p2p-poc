import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNumericFormat } from 'react-number-format';
import { useDebounce } from 'use-debounce';
import { useBalance, useNetwork } from 'wagmi';

import fiatCurrencies from '@/constants/currency';
import { fromChain, type Token } from '@/constants/tokens';
import { platformFee } from '@/constants/dapp';
import { onlyNumbers, truncateText } from '@/utils';

import useMountedAccount from './useMountedAccount';
import usePairPrice from './usePairPrice';

interface Props {
  type: 'BUY' | 'SELL';
}

export default function useTokens({ type }: Props) {
  const { address } = useMountedAccount();
  const { chain } = useNetwork();

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    fromChain(chain)[0]
  );
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[0]);

  const [tokenAmount, setTokenAmount] = useState('');
  const [debouncedTokenAmount] = useDebounce(tokenAmount, 100);

  const [fiatAmount, setFiatAmount] = useState('');
  const [debouncedFiatAmount] = useDebounce(fiatAmount, 100);

  const { data: pairPrice, isLoading: isLoadingPairPrice } = usePairPrice(
    selectedToken?.id,
    selectedFiat.id
  );

  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    token: selectedToken?.contractAddress,
  });

  const { format } = useNumericFormat({
    thousandSeparator: ',',
    decimalScale: 3,
  });

  const tokenAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);

      setTokenAmount(format(onlyNums));

      if (!pairPrice) return;

      const conversion = Number(onlyNums) * pairPrice;
      setFiatAmount(conversion <= 0 ? '' : format(conversion.toString()));
    },
    [format, pairPrice]
  );

  const fiatAmountHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const onlyNums = onlyNumbers(value);

      setFiatAmount(format(onlyNums));

      if (!pairPrice) return;
      const conversion = Number(onlyNums) / pairPrice;
      setTokenAmount(conversion <= 0 ? '' : format(conversion.toString()));
    },
    [format, pairPrice]
  );

  const tokens = useMemo(() => fromChain(chain), [chain]);

  const formattedPairPrice = useMemo(() => {
    if (!pairPrice || !selectedToken) return undefined;

    let price = pairPrice;

    if (type === 'BUY') {
      price = 1 / pairPrice;
    }

    return truncateText(format(price.toString()), {
      startPos: 12,
      endingText: selectedToken.symbol,
    });
  }, [pairPrice, selectedToken, type, format]);

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

  useEffect(() => {
    setSelectedToken(tokens[0]);
  }, [tokens]);

  return {
    selectedToken,
    selectedFiat,
    setSelectedToken,
    setSelectedFiat,
    fiatAmount: debouncedFiatAmount,
    tokenAmount: debouncedTokenAmount,
    fiatAmountHandler,
    tokenAmountHandler,
    pairPrice: formattedPairPrice,
    isLoadingPairPrice,
    tokenBalance,
    computedBalance,
    computedPlatformFee,
    refetchTokenBalance,
    tokens,
  };
}
