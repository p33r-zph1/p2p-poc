import { baseAPI } from './constants';

export interface Rate {
  [currency: string]: number;
}

export interface PairPrice {
  [tokenId: string]: Rate;
}

export async function getPairPrice(pair1?: string, pair2?: string) {
  if (!pair1 || !pair2) {
    throw new Error('Invalid pair was provided');
  }

  const url = `${baseAPI}/v3/simple/price?ids=${pair1}&vs_currencies=${pair2}`;
  const response = await fetch(url);
  const pairPrice = (await response.json()) as PairPrice;

  if (!response.ok || !pairPrice[pair1][pair2]) {
    throw new Error(`Could not retrieve price for pair ${pair1} : ${pair2}`);
  }

  return pairPrice[pair1][pair2];
}
