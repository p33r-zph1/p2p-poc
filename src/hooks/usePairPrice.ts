import { useQuery } from '@tanstack/react-query';

export interface Rate {
  [currency: string]: number;
}

export interface PairPrice {
  [tokenId: string]: Rate;
}

export async function getPairPrice(
  pair1: string | undefined,
  pair2: string | undefined
) {
  if (!pair1 || !pair2) {
    throw new Error('Invalid pair was provided');
  }

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${pair1}&vs_currencies=${pair2}`;
  const response = await fetch(url);
  const pairPrice = (await response.json()) as PairPrice;

  if (!response.ok || !pairPrice[pair1][pair2]) {
    throw new Error(`Could not retrieve price for pair ${pair1} : ${pair2}`);
  }

  return pairPrice[pair1][pair2];
}

function usePairPrice(pair1: string | undefined, pair2: string | undefined) {
  return useQuery({
    queryKey: [pair1, pair2],
    queryFn: async () => getPairPrice(pair1, pair2),
  });
}

export default usePairPrice;
