export type BankInfo = [string, RegExp];

/**
 * @description Bank names from https://bank-code.net/swift-code/[SWIFT_CODE].html
 */

const BNORPHMMXXX: BankInfo = ['BDO UNIBANK, INC.', /^\d{1,12}$/];
const DCPHPHM1XXX: BankInfo = ['DCPAY PHILIPPINES, INC', /^\d{11}$/];
const GXCHPHM2XXX: BankInfo = ['G-XCHANGE, INC.', /^\d{11}$/];
const PAPHPHM1XXX: BankInfo = ['PAYMAYA PHILIPPINES INC.', /^\d{12}$/];
const UBPHPHMMXXX: BankInfo = ['UNION BANK OF THE PHILIPPINES', /^\d{12}$/];
const BOPIPHMMXXX: BankInfo = [
  'BANK OF THE PHILIPPINE ISLANDS',
  /^(\d{10}|\d{14})$/,
];

const BANK_INFO = {
  PAPHPHM1XXX,
  UBPHPHMMXXX,
  BOPIPHMMXXX,
};

export function bankInfoToArray() {
  const values = Object.values(BANK_INFO);
  const bankNames = values.map(v => v[0]);

  return bankNames;
}

export default BANK_INFO;
