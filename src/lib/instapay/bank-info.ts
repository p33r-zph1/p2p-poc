export type BankInfo = [string, RegExp];

/**
 * @description Bank names from https://bank-code.net/swift-code/[SWIFT_CODE].html
 */

const BNORPHMMXXX: BankInfo = ['Banco De Oro Unibank, Inc.', /^\d{1,12}$/];
// const DCPHPHM1XXX: BankInfo = ['DCPAY PHILIPPINES, INC', /^\d{11}$/];
// const GXCHPHM2XXX: BankInfo = ['G-XCHANGE, INC.', /^\d{11}$/];
const PAPHPHM1XXX: BankInfo = ['PayMaya', /^\d{12}$/];
const UBPHPHMMXXX: BankInfo = ['Union Bank of the Philippines (UBP)', /^\d{12}$/];
const BOPIPHMMXXX: BankInfo = [
  'BANK OF THE PHILIPPINE ISLANDS',
  /^(\d{10}|\d{14})$/,
];

const BANK_INFO: Record<string, BankInfo> = {
  BNORPHMMXXX,
  PAPHPHM1XXX,
  UBPHPHMMXXX,
  BOPIPHMMXXX,
};

function bankInfoToArray() {
  const values = Object.values(BANK_INFO);
  const bankNames = values.map(v => v[0]);
  
  return bankNames;
}

const otherPhBanks = [
  "AllBank Inc.",
  "Asia United Bank (AUB)",
  "BDO Network Bank",
  "BPI Direct BanKO, Inc., A Savings Bank",
  // "Banco De Oro Unibank, Inc.",
  "Bangko Mabuhay (A Rural Bank), Inc.",
  "Bank of Commerce",
  "Bank of the Philippine Islands (BPI)",
  "Binangonan Rural Bank (BRBDigital)",
  "CARD Bank",
  "CARD SME Bank, Inc., A Thrift Bank",
  "CIMB Bank Philippines",
  "CIS Bayad Center, Inc. (CBCI)",
  "CTBC Bank (Philippines) Corp.",
  "Camalig Bank",
  "Cebuana Lhuillier Rural Bank, Inc.",
  "China Bank Savings",
  "China Banking Corporation",
  "Coins.PH",
  "DCPAY Philippines",
  "Development Bank of the Philippines",
  "Dungganon Bank (A Microfinance Rural Bank), Inc.",
  "East West Banking Corporation",
  "EastWest Rural Bank or Komo",
  "Equicom Savings Bank, Inc.",
  "GCash",
  "GoTyme Bank",
  "GrabPay",
  "ISLA Bank",
  "Land Bank of The Philippines",
  "Legazpi Savings Bank, Inc.",
  "Lulu Financial Services (Phils) Inc.",
  "Malayan Bank Savings and Mortgage Bank, Inc.",
  "Maybank Philippines",
  "Metropolitan Bank and Trust Company (Metrobank)",
  "Mindanao Consolidated Cooperative Bank",
  "Netbank (Community Rural Bank of Romblon)",
  "Omnipay, Inc.",
  "PNB Savings Bank",
  "PalawanPay",
  "Partner Rural Bank (Cotabato), Inc.",
  // "PayMaya",
  "Philippine Bank of Communications (PBCOM)",
  "Philippine Business Bank, Inc., A Savings Bank",
  "Philippine National Bank (PNB)",
  "Philippine Savings Bank (PSBank)",
  "Philippine Trust Company",
  "Philippine Veterans Bank",
  "Producers Bank",
  "Queen City Development Bank, Inc.",
  "Quezon Capital Rural Bank, Inc",
  "Rizal Commercial Banking Corporation (RCBC)",
  "Robinsons Bank",
  "Rural Bank of Guinobatan, Inc.",
  "Seabank Philippines Inc.",
  "Security Bank Corporation",
  "ShopeePay",
  "Standard Chartered Bank",
  "Starpay Corporation",
  "Sterling Bank of Asia",
  "Sun Savings Bank",
  "Tayocash Inc.",
  "Tonik Digital Bank, Inc.",
  "UCPB Savings bank",
  "UNObank, Inc",
  "USSC Money Services Inc",
  // "Union Bank of the Philippines (UBP)",
  "Union Digital Bank",
  "United Coconut Planters Bank (UCPB)",
  "Wealth Development Bank Corporation",
  "Zybi Tech Inc.",
]

export const toPhBankInfo = [...bankInfoToArray(), ...otherPhBanks].sort();

export default BANK_INFO;
