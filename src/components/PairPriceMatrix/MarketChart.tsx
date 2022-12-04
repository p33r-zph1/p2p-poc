import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import usePriceChart from '@/hooks/usePriceChart';

export enum PairDataTimeWindowEnum {
  DAY = 1,
  WEEK = 7,
  MONTH = 30,
  YEAR = 365,
}

const dateFormattingByTimewindow: Record<
  PairDataTimeWindowEnum,
  Intl.DateTimeFormatOptions
> = {
  [PairDataTimeWindowEnum.DAY]: {
    hour: '2-digit',
    minute: '2-digit',
  },
  [PairDataTimeWindowEnum.WEEK]: {
    month: 'short',
    day: '2-digit',
  },
  [PairDataTimeWindowEnum.MONTH]: {
    month: 'short',
    day: '2-digit',
  },
  [PairDataTimeWindowEnum.YEAR]: {
    month: 'short',
    day: '2-digit',
  },
};

interface Props {
  coinId: string;
  currency: string;
  days: PairDataTimeWindowEnum;
}

function MarketChart({ coinId, currency, days }: Props) {
  const { data } = usePriceChart({ coinId, currency, days });

  const chartData = useMemo(() => {
    if (!data || !data.prices.length) return [];

    return data.prices.map(([time, price]) => ({
      time: new Date(time),
      price,
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
          left: 20,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickFormatter={(time: Date) =>
            time.toLocaleString('en', dateFormattingByTimewindow[days])
          }
        />
        <YAxis tickFormatter={(price: number) => price.toFixed(5)} />
        <Tooltip />
        <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MarketChart;
