import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, UserIcon } from '@heroicons/react/20/solid';
import { Address } from 'wagmi';

import { BankInfo } from '@/hooks/useOnboarding';
import { classNames } from '@/utils';

import { InlineErrorDisplay } from '../shared';
import { BankIcon, WalletIcon } from '../icons';

interface Props {
  isOpen: boolean;
  close(): void;
  saveBankInfo(bankInfo: BankInfo): Promise<BankInfo>;
  bankInfo: BankInfo | undefined;
  walletAddress: Address | undefined;
}

type Status =
  | 'idle'
  | 'validatingWallet'
  | 'validatingBank'
  | 'validated'
  | 'rejected';

interface StatusIndicatorProps {
  status: Status;
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div className="relative mx-auto h-40 w-40 rounded-full bg-[#EBF5FF]">
      <div
        className={classNames(
          status === 'validatingBank' ? 'bg-brand' : '',
          status === 'validated' ? 'bg-[#25D3B0]' : 'animate-pulse',
          'absolute top-1/2 left-1/2 h-1 w-1/2 origin-bottom-left -translate-y-1/2 -rotate-45 bg-white transition-colors'
        )}
      />

      <div
        className={classNames(
          status === 'validatingWallet' ? 'scale-75 bg-blue-400' : '',
          status === 'validatingBank' ? 'scale-110 bg-brand' : '',
          status === 'validated' ? 'bg-[#25D3B0]' : '',
          'absolute top-0 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all'
        )}
      >
        <BankIcon className="text-white" />
      </div>

      <div
        className={classNames(
          status === 'validatingBank'
            ? 'bg-gradient-to-tr from-[#319BFF] via-[#25D3B0] to-[#25D3B0]'
            : '',
          status === 'validated'
            ? 'scale-100 bg-[#25D3B0]'
            : 'scale-75 bg-brand',
          'absolute top-1/2 left-1/2 z-10 flex h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full p-2 text-white transition-colors'
        )}
      >
        <UserIcon className="h-full w-full" />
      </div>

      <div
        className={classNames(
          status === 'validatingWallet' ? 'scale-110 bg-brand' : '',
          status === 'validatingBank' ? 'scale-75 bg-[#25D3B0]' : '',
          status === 'validated' ? 'bg-[#25D3B0]' : '',
          'absolute bottom-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all'
        )}
      >
        <WalletIcon className="text-white" />
      </div>

      <div
        className={classNames(
          status === 'validatingWallet' ? 'animate-pulse bg-brand' : '',
          status === 'validatingBank' ? 'bg-[#25D3B0]' : '',
          status === 'validated' ? 'bg-[#25D3B0]' : '',
          'absolute bottom-1/2 right-1/2 h-1 w-1/2 origin-bottom-right translate-y-1/2 -rotate-45 transition-colors'
        )}
      />
    </div>
  );
}

function ZpkKycModal({
  close,
  isOpen,
  saveBankInfo,
  walletAddress,
  bankInfo,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');

  // Start validation
  useEffect(() => {
    if (isOpen && status === 'idle') {
      setStatus('validatingWallet');
    }
  }, [isOpen, status]);

  // Reset mock validation
  useEffect(() => {
    if (!isOpen && status != 'idle') {
      let ignore = false;

      // Waiting for modal close animation to finish
      // to reset state (leave duration 200ms)
      const id = setTimeout(() => {
        if (!ignore) {
          setStatus('idle');
        }
      }, 300);

      return () => {
        ignore = true;
        clearTimeout(id);
      };
    }
  }, [isOpen, status]);

  // Mock validating wallet address
  useEffect(() => {
    if (isOpen && status === 'validatingWallet') {
      let ignore = false;

      const id = setTimeout(() => {
        if (!ignore) {
          setStatus('validatingBank');
        }
      }, 2000);

      return () => {
        ignore = true;
        clearTimeout(id);
      };
    }
  }, [isOpen, status, walletAddress]);

  // Validating payment details
  useEffect(() => {
    if (isOpen && status === 'validatingBank') {
      if (!bankInfo) {
        setStatus('rejected');
        return;
      }

      saveBankInfo(bankInfo)
        .then(() => setStatus('validated'))
        .catch(() => setStatus('rejected'));
    }
  }, [isOpen, bankInfo, status, saveBankInfo]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-2">
            {(status === 'validated' || status === 'rejected') && (
              <button onClick={close} className="relative w-full">
                <XCircleIcon className="absolute right-0 mr-4 h-7 w-7" />
              </button>
            )}

            <div className="p-8">
              <StatusIndicator status={status} />

              <Dialog.Title className="mt-10 text-center font-sans text-xl font-semibold md:text-2xl">
                ZPK Kyc
              </Dialog.Title>
              <Dialog.Description
                className={classNames(
                  status !== 'validated' ? 'animate-pulse' : '',
                  'text-center text-sm text-sleep-100'
                )}
              >
                {status === 'idle' && 'Idle'}

                {status === 'validatingWallet' &&
                  'Validating your wallet address...'}

                {status === 'validatingBank' &&
                  'Validating bank account details...'}

                {status === 'validated' &&
                  'Validation complete. You may now transact!'}

                <InlineErrorDisplay
                  show={status === 'rejected'}
                  error="Failed to validate payment details"
                />
              </Dialog.Description>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ZpkKycModal;
