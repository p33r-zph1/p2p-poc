import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useConnect, useDisconnect } from 'wagmi';

import { getAppDomainName } from '@/constants/build';

import useMountedAccount from './useMountedAccount';
import { isPropertyWithKey } from '@/utils/isError';

function useAuth() {
  const { connect, connectors, ...connectProps } = useConnect();
  const { disconnect, ...disconnectProps } = useDisconnect();

  const { isConnected, address } = useMountedAccount();

  const [hasError, setHasError] = useState<string | undefined>();

  const connectWallet = useCallback(() => {
    if (typeof isPropertyWithKey(window, 'ethereum') === 'undefined') {
      const deepLink = `https://metamask.app.link/dapp/${getAppDomainName({
        localhostAllowed: false,
      })}`;

      window.open(
        isMobile ? deepLink : 'https://metamask.io/',
        '_blank',
        'noopener,noreferrer'
      );

      return;
    }

    // grab the first connector (defined in _app.tsx `wagmiConfig`)
    const injectedConnector = connectors[0];

    // connect using the injected connector
    connect({ connector: injectedConnector });
  }, [connect, connectors]);

  useEffect(() => {
    // clear the auth error state when address changes
    setHasError(undefined);
  }, [address]);

  return {
    connect: connectWallet,
    disconnect,
    connectProps,
    disconnectProps,
    isConnected,
    address,
    hasError,
    setHasError,
  };
}

export default useAuth;
