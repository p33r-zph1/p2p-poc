import { useQuery } from '@tanstack/react-query';

interface HistoricalData {
  prices: [number, number][];
}

async function getHistoricalData(
  coinId: string,
  currency: string,
  days: number
) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
  const response = await fetch(url);
  const historicalData = (await response.json()) as HistoricalData;

  if (!response.ok) {
    throw new Error('Could not fetch chart data');
  }

  return historicalData;
}

interface Options {
  coinId: string;
  currency: string;
  days: number;
}

function usePriceChart({ coinId, currency, days }: Options) {
  return useQuery({
    queryKey: [coinId, currency, days],
    queryFn: () => getHistoricalData(coinId, currency, days),
  });
}

export default usePriceChart;
