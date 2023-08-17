import { bankInfoToArray } from '@/lib/instapay/bank-info';
import fiatCurrencies, { Currency } from './currency';
import { SG_BANKS } from '@/lib/sg/bank-info';

export type PaymentField = {
  label: string;
  id: string;
  value: string;
  options?: string[];
};

export type PaymentDetails = {
  name: string;
  countryCode: string;
  currency: Currency;
  fields: PaymentField[];
};

export const paymentCountries: PaymentDetails[] = [
  {
    name: 'Philippines',
    countryCode: 'ph',
    currency: fiatCurrencies[1],
    fields: [
      {
        id: 'bank-name',
        label: 'Bank Name',
        options: bankInfoToArray(),
        value: bankInfoToArray()[0],
      },
      {
        id: 'account-name',
        label: 'Account Name',
        value: '',
      },
      {
        id: 'account-number',
        label: 'Account/Mobile Number (InstaPay)',
        value: '',
      },
    ],
  },
  {
    name: 'Singapore',
    countryCode: 'sg',
    currency: fiatCurrencies[0],

    fields: [
      {
        id: 'bank-name',
        label: 'Bank Name',
        options: SG_BANKS,
        value: SG_BANKS[0],
      },
      {
        id: 'account-name',
        label: 'Account Name',
        value: '',
      },
      {
        id: 'account-number',
        label: 'Account Number',
        value: '',
      },
    ],
  },
];
