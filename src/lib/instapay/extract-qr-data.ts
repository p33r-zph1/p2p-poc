import BANK_INFO from './bank-info';
import {
  BANK_INFO_KEY,
  BANK_INFO_KEY_ALT,
  SWIFT_CODE_KEY,
  ACCOUNT_NUMBER_KEY,
  COUNTRY_CODE_KEY,
  NAME_KEY,
  CITY_KEY,
} from './constants';

export function extractQrData(parsedQrData: Record<string, any>) {
  const bankInfo =
    parsedQrData[BANK_INFO_KEY] || parsedQrData[BANK_INFO_KEY_ALT];
  const countryCode = parsedQrData[COUNTRY_CODE_KEY];
  const city = parsedQrData[CITY_KEY];
  const name = parsedQrData[NAME_KEY];
  const accountNumber = bankInfo?.[ACCOUNT_NUMBER_KEY];
  const swiftCode = bankInfo?.[SWIFT_CODE_KEY];
  const bankName = BANK_INFO[swiftCode]?.[0];

  return {
    countryCode,
    city,
    name,
    accountNumber,
    swiftCode,
    bankName,
  };
}
