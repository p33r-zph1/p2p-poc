import { useState } from 'react';
import { Tab } from '@headlessui/react';

import { classNames } from '@/utils';
import { Token } from '@/constants/tokens';
import { Currency } from '@/constants/currency';

import MarketChart, { PairDataTimeWindowEnum } from './MarketChart';
import { InlineErrorDisplay } from '../shared';

const tabs = [
  { label: '24h', value: PairDataTimeWindowEnum.DAY },
  { label: '1w', value: PairDataTimeWindowEnum.WEEK },
  { label: '1m', value: PairDataTimeWindowEnum.MONTH },
  { label: '1y', value: PairDataTimeWindowEnum.YEAR },
];

interface Props {
  token: Token | undefined;
  fiat: Currency | undefined;
}

function PairPriceMatrix({ token, fiat }: Props) {
  const [days, setDays] = useState(PairDataTimeWindowEnum.DAY);

  if (!token || !fiat)
    return <InlineErrorDisplay show error="No prices available" />;

  return (
    <div className="mt-5 h-full px-2 pb-5 md:px-5 lg:px-10">
      <h3 className="text-xl font-bold uppercase md:text-2xl">
        {token.symbol} / {fiat.symbol}
      </h3>

      <div className="mt-3 bg-white">
        <Tab.Group>
          <Tab.List className="my-5 flex space-x-1 rounded-xl bg-gray-100 p-1">
            {tabs.map(tab => (
              <Tab
                onClick={() => setDays(tab.value)}
                key={tab.label}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-2xl py-2.5 text-sm font-bold leading-5',
                    'uppercase ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-[#25D3B0] text-white shadow'
                      : 'text-[#25D3B0] hover:bg-[#25D3B0] hover:text-white'
                  )
                }
              >
                {tab.label}
              </Tab>
            ))}
          </Tab.List>

          <hr />

          <div className="mt-2 h-[600px]">
            <MarketChart coinId={token.id} currency={fiat.id} days={days} />
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}

export default PairPriceMatrix;
