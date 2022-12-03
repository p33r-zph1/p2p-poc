import { getAddress } from '@ethersproject/address';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);

  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function onlyNumbers(value: string): string {
  return value.replace(/[^0-9.]/g, '');
}

export function errorWithReason(
  error: unknown
): error is Error & { reason: string } {
  if (error === null || error === undefined) return false;

  return typeof error === 'object' && 'message' in error && 'reason' in error;
}
