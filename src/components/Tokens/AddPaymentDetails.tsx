import { FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import QrScanner from 'qr-scanner';

import { PaymentDetails } from '@/pages';
import { extractQrData, getErrors, parseQrData } from '@/lib/instapay';
import { InlineErrorDisplay } from '../shared';
import ZPKycModal from './ZPKycModal';

const defaultPaymentDetailsState = {
  country: 'Philippines',
  mobileNumber: '',
};

interface Props {
  addPaymentDetails(paymentDetails: PaymentDetails): void;
  walletAddress?: string;
}

function AddPaymentDetails({ addPaymentDetails, walletAddress }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(
    defaultPaymentDetailsState
  );
  const [imageFile, setImageFile] = useState<File>();
  const [qrPreview, setQrPreview] = useState<string>();

  useEffect(() => {
    if (!imageFile) {
      setQrPreview(undefined);
      setPaymentDetails(defaultPaymentDetailsState);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        setError('');

        const result = reader.result;
        if (typeof result !== 'string') throw {};

        const data = await QrScanner.scanImage(result, {});
        const parsedData = parseQrData(data);
        const qrData = extractQrData(parsedData);
        const recoverableErrors = getErrors(qrData);

        // TODO(dennis): display errors

        if (qrData?.accountNumber) {
          setPaymentDetails(state => ({
            ...state,
            mobileNumber: qrData.accountNumber,
          }));
        }

        setQrPreview(result);
      } catch (error) {
        setError('Failed to read the Qr Code');
        setQrPreview(undefined);
        setPaymentDetails(defaultPaymentDetailsState);
        console.error({ error });
      }
    };

    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!paymentDetails.country.trim()) {
      setError('Country is required.');
      return;
    }

    if (!paymentDetails.mobileNumber.trim()) {
      setError('Mobile number is required.');
      return;
    }

    setIsOpen(true);
  };

  const onValidated = useCallback(
    (details: PaymentDetails) => {
      addPaymentDetails(details);
    },
    [addPaymentDetails]
  );

  return (
    <div className="mt-5 overflow-hidden rounded-xl bg-white p-5 md:mt-0 lg:p-10">
      <p className="font-semibold md:text-2xl">Provide your payment details</p>
      <p className="text-sm text-sleep-100">
        Select your country and provide PayNow (SG) or InstaPay (PH) details
      </p>

      <ZPKycModal
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        paymentDetails={paymentDetails}
        walletAddress={walletAddress}
        onValidated={onValidated}
      />

      <form onSubmit={onSubmit}>
        <div className="bg-white py-5">
          <InlineErrorDisplay show={Boolean(error)} error={error} />

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <label
                htmlFor="country"
                className="block text-sm font-semibold text-sleep-100"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                autoComplete="country"
                className="mt-1 block w-full rounded-md border border-[#E7E9EB] bg-white  py-2 px-3 text-sleep-100 shadow-sm focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                onChange={e =>
                  setPaymentDetails(state => ({
                    ...state,
                    country: e.target.value,
                  }))
                }
                value={paymentDetails.country}
              >
                <option>Philippines</option>
                <option>Singapore</option>
              </select>
            </div>

            <div className="col-span-6">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-semibold text-sleep-100"
              >
                Mobile number for your PayNow or InstaPay
              </label>
              <input
                type="text"
                name="mobileNumber"
                id="mobileNumber"
                autoComplete="mobileNumber"
                className="mt-1 block w-full rounded-md border-[#E7E9EB] text-sleep-100 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                onChange={e =>
                  setPaymentDetails(state => ({
                    ...state,
                    mobileNumber: e.target.value,
                  }))
                }
                value={paymentDetails.mobileNumber}
              />
            </div>
          </div>

          <div className="my-5 flex items-center">
            <span className="h-px w-full bg-[#E7E9EB]" />
            <p className="px-5 text-sm font-semibold text-sleep-100">OR</p>
            <span className="h-px w-full bg-[#E7E9EB]" />
          </div>

          <div className="flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              {qrPreview ? (
                <Image
                  src={qrPreview}
                  width={100}
                  height={100}
                  alt="qr image preview"
                  className="object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowDownTrayIcon
                    aria-hidden="true"
                    className="mb-3 h-10 w-10 text-gray-400"
                  />

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Click here to upload your QR
                    </span>
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (file && file.type.substring(0, 5) === 'image')
                    setImageFile(file);
                  else setImageFile(undefined);

                  // this line right below will reset the
                  // input field so if you removed it you can re-add the same file
                  event.target.value = '';
                }}
              />
            </label>
          </div>
        </div>

        <div className="mt-3 text-right">
          <button
            type="submit"
            disabled={isOpen}
            className="inline-flex justify-center rounded-2xl border border-transparent bg-brand py-2 px-5 text-sm font-bold text-white shadow-sm hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-sleep disabled:text-sleep-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPaymentDetails;
