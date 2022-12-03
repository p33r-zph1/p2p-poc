export interface Currency {
  symbol: string;
  id: string;
  icon?: string;
}

const fiatCurrencies: Currency[] = [
  { symbol: 'SGD', id: 'sgd', icon: '/images/logo-icon.svg' },
  { symbol: 'PHP', id: 'php', icon: '/images/logo-icon.svg' },
];

export default fiatCurrencies;
