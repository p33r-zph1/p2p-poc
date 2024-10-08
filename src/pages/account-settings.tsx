import { Navigation } from '@/components/layout';
import useIsMounted from '@/hooks/useIsMounted';
import useAuth from '@/hooks/useAuth';
import Accounts from '@/components/AccountDetails/Accounts';
import { useRouter } from 'next/router';

function AccountSettingsPage() {
  const router = useRouter();

  const {
    connect,
    disconnect,
    connectProps,
    isConnected,
    address,
    hasError,
    setHasError,
  } = useAuth();

  const mounted = useIsMounted();

  if (!mounted) return null; // TODO(dennis): display loading indicator while wagmi is hydrating

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation
        connected={isConnected}
        isConnecting={connectProps.isLoading}
        walletAddress={address}
        connectWallet={connect}
        disconnectWallet={disconnect}
      />

      <main className="flex-1 p-4 md:flex md:items-center md:justify-center md:p-8 lg:px-10">
        <div className="mt-16 w-full md:mt-0">
          <div className="md:px-5 lg:px-10">
            {isConnected ? (
              <>
                {hasError ? (
                  <div className="mx-auto max-w-md rounded-xl bg-white p-5">
                    <h1 className="m-5 text-center font-sans text-xl font-semibold md:text-2xl">
                      {hasError}
                    </h1>
                    <button
                      type="button"
                      className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                      onClick={() => router.push('/')}
                    >
                      Link an Account
                    </button>
                    <p className="mt-10 text-center text-sm">
                      When your active address in MetaMask <b>does not match</b>{' '}
                      the address in P33R, make sure that your selected account
                      in MetaMask is connected.
                    </p>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-semibold text-body md:text-2xl">
                      Account Settings
                    </h1>

                    <div className="my-3">
                      {/* {isFetching ? (
                        <div className="h-2.5 w-12 animate-pulse rounded-full bg-gray-300"></div>
                      ) : ( */}
                      <p className="text-sm text-sleep-100">
                        You have 1 Linked Bank Account
                      </p>
                      {/* )} */}
                    </div>

                    <div className="my-5">
                      <Accounts
                        walletAddress={address}
                        setHasError={setHasError}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-md rounded-xl bg-white p-5">
                <h3 className="m-5 text-center font-sans text-xl font-semibold md:text-2xl">
                  Please connect your wallet
                </h3>

                <button
                  type="button"
                  className="w-full rounded-4xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90 focus:outline-none focus:ring focus:ring-brand/80 active:bg-brand/80 disabled:bg-sleep disabled:text-sleep-300"
                  disabled={connectProps.isLoading}
                  onClick={connect}
                >
                  {connectProps.isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AccountSettingsPage;
