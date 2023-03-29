export interface Currency {
  symbol: string;
  id: string;
  icon: string | undefined;
}

const fiatCurrencies: Currency[] = [
  { symbol: 'SGD', id: 'sgd', icon: '/images/singapore.png' },
  { symbol: 'PHP', id: 'php', icon: '/images/philippines.png' },
];

export default fiatCurrencies;
