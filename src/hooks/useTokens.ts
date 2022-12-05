import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useBalance, useNetwork } from 'wagmi';

import fiatCurrencies from '@/constants/currency';
import { fromChain, type Token } from '@/constants/tokens';
import { onlyNumbers } from '@/utils';

import useMountedAccount from './useMountedAccount';
import usePairPrice from './usePairPrice';

export default function useToken() {
  const { address } = useMountedAccount();
  const { chain } = useNetwork();

  const tokens = useMemo(() => fromChain(chain), [chain]);

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

  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    token: selectedToken?.contractAddress,
  });

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
    pairPrice,
    isLoadingPairPrice,
    tokenBalance,
    refetchTokenBalance,
    tokens,
  };
}
