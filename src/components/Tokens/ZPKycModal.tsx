import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { PaymentDetails } from '@/pages';
import { InlineErrorDisplay } from '../shared';

interface Props {
  isOpen: boolean;
  close(): void;
  onValidated(paymentDetails: PaymentDetails): void;
  paymentDetails?: PaymentDetails;
  walletAddress?: string;
}

type Status =
  | 'idle'
  | 'validatingWallet'
  | 'validatingBank'
  | 'validated'
  | 'rejected';

function ZPKycModal({
  close,
  isOpen,
  onValidated,
  walletAddress,
  paymentDetails,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');

  // Start mock validation
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
          console.log({ walletAddress });
          setStatus('validatingBank');
        }
      }, 2000);

      return () => {
        ignore = true;
        clearTimeout(id);
      };
    }
  }, [isOpen, status, walletAddress]);

  // Mock validating payment details
  useEffect(() => {
    if (isOpen && status === 'validatingBank') {
      let ignore = false;

      const id = setTimeout(() => {
        if (!ignore) {
          console.log({ paymentDetails });
          setStatus('validated');
        }
      }, 2000);

      return () => {
        ignore = true;
        clearTimeout(id);
      };
    }
  }, [isOpen, paymentDetails, status]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={() => {
          if (status === 'validated' && paymentDetails) {
            onValidated(paymentDetails);
          }

          close();
        }}
      >
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
          <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-10">
            <Dialog.Title className="text-center">ZPKyc</Dialog.Title>
            <Dialog.Description className="text-center">
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
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ZPKycModal;
