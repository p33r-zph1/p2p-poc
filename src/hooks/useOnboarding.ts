import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  city: string;
  swiftCode: string;
}

export interface BankInfo {
  countryCode: string;
  bankDetails: BankDetails;
}

export interface OnboardingResponse {
  data: BankInfo;
  message: string;
  copyright: string;
}

export async function getUser(walletAddress?: Address) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const url = `https://od21v6lbu1.execute-api.ap-southeast-1.amazonaws.com/develop/${walletAddress}`;
  const response = await fetch(url);

  const getUserResponse = (await response.json()) as OnboardingResponse;

  if (!response.ok || !getUserResponse.data?.bankDetails) {
    throw new Error(`Failed to get user information`);
  }

  return getUserResponse.data;
}

export async function saveUser(bankInfo?: BankInfo) {
  if (!bankInfo) {
    throw new Error('Bank details is required');
  }

  const url = `https://od21v6lbu1.execute-api.ap-southeast-1.amazonaws.com/develop`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bankInfo),
  });

  const saveUserResponse = (await response.json()) as OnboardingResponse;

  if (!response.ok || !saveUserResponse.data?.bankDetails) {
    throw new Error(`Failed to save user information`);
  }

  return saveUserResponse.data;
}

export function useGetUser(connected: boolean, walletAddress?: Address) {
  return useQuery({
    queryKey: [walletAddress],
    queryFn: async () => getUser(walletAddress),
    enabled: Boolean(walletAddress) && connected,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useSaveUser(connected: boolean, bankInfo?: BankInfo) {
  return useQuery({
    queryKey: [],
    queryFn: async () => saveUser(bankInfo),
    enabled: Boolean(bankInfo) && connected,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
