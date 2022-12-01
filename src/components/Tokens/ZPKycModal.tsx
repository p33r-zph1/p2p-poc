import { Dialog } from '@headlessui/react';

import { PaymentDetails } from '@/pages';

interface Props {
  isOpen: boolean;
  close(): void;
  onSuccess(): void;
  paymentDetails?: PaymentDetails;
  walletAddress?: string;
}

function ZPKycModal({
  close,
  isOpen,
  onSuccess,
  walletAddress,
  paymentDetails,
}: Props) {
  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-10">
          <Dialog.Title className="text-center">ZPKyc</Dialog.Title>
          <Dialog.Description className="text-center">
            Validating your wallet address...
          </Dialog.Description>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ZPKycModal;
