import { classNames } from '@/utils';
import { Tab } from '@headlessui/react';
import MarketChart from './MarketChart';

const tabs = ['24h', '1w', '1m', '1y'];

function PairPriceMatrix() {
  return (
    <div className="mt-10 h-full md:mt-0">
      <h3 className="text-xl font-bold md:text-2xl">ETH / USD</h3>

      <div className="mt-3 bg-white p-5 md:p-10">
        <p className="text-lg font-bold">$1,350 (-2,1%)</p>
        <p className="text-sm text-sleep-100">Nov 28, 2022, 10:47 AM</p>

        <Tab.Group>
          <Tab.List className="my-5 flex space-x-1 rounded-xl bg-gray-100 p-1">
            {tabs.map(tab => (
              <Tab
                key={tab}
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
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <hr />

          <Tab.Panels className="mt-2">
            {tabs.map(tab => (
              <Tab.Panel key={tab} className="h-[600px]">
                <MarketChart />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default PairPriceMatrix;
