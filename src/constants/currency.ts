export interface Currency {
  symbol: string;
  icon?: string;
}

const fiatCurrencies: Currency[] = [
  { symbol: 'USD', icon: '/images/ethereum.svg' },
  { symbol: 'PHP', icon: '/images/polygon.svg' },
];

export default fiatCurrencies;
