import { Address } from 'wagmi';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getErrorMessage } from '@/utils/isError';

import { classNames } from '@/utils';

import { InlineErrorDisplay } from '../shared';
import AccountSkeleton from './AccountSkeleton';
import { useDeleteUser, useGetUser } from '@/hooks/useOnboarding';
import Account from './Account';

interface Props {
  walletAddress: Address | undefined;
  setHasError: Dispatch<SetStateAction<string | undefined>>;
}

function Accounts({ walletAddress, setHasError }: Props) {
  const {
    data: bankInfo,
    refetch: refetchBankInfo,
    isFetching,
    isError,
    error,
  } = useGetUser(walletAddress);

  const { refetch: deleteUser, isFetching: isDeletinguser } =
    useDeleteUser(walletAddress);

  useEffect(() => {
    if (isError) {
      setHasError(getErrorMessage(error));
    }
  }, [isError, error, setHasError]);

  if (isFetching || isDeletinguser) {
    return (
      <div className="overflow-hidden rounded-xl bg-white">
        {Array.from({ length: 4 }).map((_, idx) => (
          <AccountSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError || !bankInfo) {
    return (
      <InlineErrorDisplay
        show={isError}
        error={
          error instanceof Error
            ? error.message
            : 'Failed to retrieve bank details.'
        }
      />
    );
  }

  return (
    <>
      <div className="rounded-xl bg-white">
        {/* {isSuccess && !data.length && (
          <p className="p-[50px] text-center text-sleep-300">No linked bank details</p>
        )} */}

        {/* map through <Account /> if we have a list of account */}
        <Account bankInfo={bankInfo} unlink={deleteUser} />
      </div>
    </>
  );
}

export default Accounts;
