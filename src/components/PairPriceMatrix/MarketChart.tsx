import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

function MarketChart() {
  const [coinId] = useState('tether');
  const [currency] = useState('usd');
  const [days] = useState(1);

  const { data } = useQuery({
    queryKey: [coinId, currency, days],
    queryFn: () => getHistoricalData(coinId, currency, days),
  });

  const chartData = useMemo(() => {
    if (!data || !data.prices.length) return [];

    return data.prices.map(([coin, targetCurrancy]) => ({
      name: 'Page A',
      uv: coin,
      pv: targetCurrancy,
    }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MarketChart;
