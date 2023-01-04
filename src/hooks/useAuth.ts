import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { getAppDomainName } from '@/constants/build';
import chains from '@/constants/chains';

function useAuth() {
  const { connect, ...connectProps } = useConnect({
    // Manually setting up the connector to only use MetaMask
    // If we want to support other wallets, use the connectors prop from useConnect() hook and remove the connector below)
    // https://wagmi.sh/examples/connect-wallet
    connector: new MetaMaskConnector({
      chains,
    }),
  });
  const { disconnect, ...disconnectProps } = useDisconnect();

  const connectWallet = useCallback(() => {
    if (typeof window.ethereum === 'undefined') {
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

    connect();
  }, [connect]);

  return {
    connect: connectWallet,
    disconnect,
    connectProps,
    disconnectProps,
  };
}

export default useAuth;
