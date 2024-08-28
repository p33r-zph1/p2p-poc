import { getOnboardingAPIRoute } from '@/lib/env';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'wagmi';

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  countryCode: string;
}

export interface BankInfo {
  bankDetails: BankDetails;
}

export interface OnboardingResponse {
  data: BankInfo;
  message: string;
  copyright: string;
}

interface Response {
  data: null;
  message: string;
  copyright: string;
}

export async function getUser(walletAddress: Address | undefined) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const url = `${getOnboardingAPIRoute()}/${walletAddress}`;
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

  const url = getOnboardingAPIRoute();
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

export async function deleteUser(walletAddress: Address | undefined) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const url = `${getOnboardingAPIRoute()}/${walletAddress}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${walletAddress}`,
      'Content-Type': 'application/json',
    },
  });

  const deleteUserResponse = (await response.json()) as Response;

  if (!response.ok) {
    throw new Error(
      deleteUserResponse?.message || `Failed to delete user bank details`
    );
  }

  return deleteUserResponse.data;
}

export function useGetUser(walletAddress: Address | undefined) {
  return useQuery({
    queryKey: [walletAddress],
    queryFn: async () => getUser(walletAddress),
    enabled: Boolean(walletAddress),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useSaveUser(
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

export function useDeleteUser(walletAddress: Address | undefined) {
  const { refetch } = useGetUser(walletAddress);

  return useQuery({
    queryKey: [],
    queryFn: async () => deleteUser(walletAddress),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess() {
      refetch();
    },
  });
}
