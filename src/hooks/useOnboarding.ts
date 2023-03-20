import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

export interface PHBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

type SGBankDetails = {
  mobileNumber: string;
};

export interface BankInfo {
  bankDetails: (PHBankDetails | SGBankDetails) & { countryCode: string };
}

export interface OnboardingResponse {
  data: BankInfo;
  message: string;
  copyright: string;
}

export async function getUser(walletAddress: Address | undefined) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const url = `https://od21v6lbu1.execute-api.ap-southeast-1.amazonaws.com/develop/${walletAddress}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
    },
  });

  const getUserResponse = (await response.json()) as OnboardingResponse;

  if (!response.ok || !getUserResponse.data?.bankDetails) {
    throw new Error(
      getUserResponse?.message || `Failed to get user information`
    );
  }

  return getUserResponse.data;
}

export async function saveUser(
  walletAddress: Address | undefined,
  bankInfo: BankInfo | undefined
) {
  if (!walletAddress || !bankInfo) {
    throw new Error('Bank details and wallet address is required');
  }

  const url = `https://od21v6lbu1.execute-api.ap-southeast-1.amazonaws.com/develop`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
      walletaddress: walletAddress,
    },
    body: JSON.stringify(bankInfo),
  });

  const saveUserResponse = (await response.json()) as OnboardingResponse;

  if (!response.ok || !saveUserResponse.data?.bankDetails) {
    throw new Error(
      saveUserResponse?.message || `Failed to save user information`
    );
  }

  return saveUserResponse.data;
}

export function useGetUser(
  connected: boolean,
  walletAddress: Address | undefined
) {
  return useQuery({
    queryKey: [walletAddress],
    queryFn: async () => getUser(walletAddress),
    enabled: Boolean(walletAddress) && connected,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useSaveUser(
  connected: boolean,
  walletAddress: Address | undefined,
  bankInfo: BankInfo | undefined
) {
  return useQuery({
    queryKey: [],
    queryFn: async () => saveUser(walletAddress, bankInfo),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
