import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import useIsMounted from './useIsMounted';

export default function useMountedAccount() {
  const { isConnected: connected, ...otherProps } = useAccount();

  const isMounted = useIsMounted();

  const isConnected = useMemo(
    () => connected && isMounted,
    [connected, isMounted]
  );

  return {
    isConnected,
    ...otherProps,
  };
}
