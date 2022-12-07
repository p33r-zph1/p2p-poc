import { FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import QrScanner from 'qr-scanner';
import { Address } from 'wagmi';

import { BankInfo } from '@/hooks/useOnboarding';
import { extractQrData, getErrors, parseQrData } from '@/lib/instapay';
import { bankInfoToArray } from '@/lib/instapay/bank-info';

import { InlineErrorDisplay } from '../shared';
import ZPKycModal from './ZPKycModal';

interface Props {
  saveBankInfo(bankInfo: BankInfo): Promise<BankInfo>;
  refectchBankInfo: () => void;
  walletAddress?: Address;
}

type PaymentField = {
  label: string;
  id: string;
  value: string;
  options?: string[];
};

type PaymentDetails = {
  name: string;
  countryCode: string;
  fields: PaymentField[];
};

const paymentCountries: PaymentDetails[] = [
  {
    name: 'Philippines',
    countryCode: 'ph',
    fields: [
      {
        id: 'bank-name',
        label: 'Bank Name',
        options: bankInfoToArray(),
        value: bankInfoToArray()[0],
      },
      {
        id: 'account-name',
        label: 'Account Name',
        value: '',
      },
      {
        id: 'account-number',
        label: 'Account/Mobile Number (InstaPay)',
        value: '',
      },
      {
        id: 'city',
        label: 'City',
        value: '',
      },
    ],
  },
  {
    name: 'Singapore',
    countryCode: 'sg',
    fields: [
      {
        id: 'mobile-number',
        label: 'Mobile Number (PayNow)',
        value: '',
      },
    ],
  },
];

function AddPaymentDetails({
  saveBankInfo,
  refectchBankInfo,
  walletAddress,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(paymentCountries[0]);
  const [bankInfo, setBankInfo] = useState<BankInfo>();
  const [imageFile, setImageFile] = useState<File>();
  const [qrPreview, setQrPreview] = useState<string>();

  const fieldsHandler = useCallback(
    (updatedField: PaymentField, fields: PaymentField[]) => {
      return fields.map(field => {
        if (field.label === updatedField.label) {
          field.value = updatedField.value;
        }
        return field;
      });
    },
    []
  );

  useEffect(() => {
    if (!imageFile) {
      setQrPreview(undefined);
      setBankInfo(undefined);
      setPaymentDetails(paymentCountries[0]);
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

        if (qrData?.countryCode === 'PH') {
          let field = paymentCountries[0].fields[0];

          field.value = qrData?.bankName || '';
          setPaymentDetails(state => ({
            ...state,
            fields: fieldsHandler(field, state.fields),
          }));

          field = paymentCountries[0].fields[1];
          field.value = qrData?.name || '';

          setPaymentDetails(state => ({
            ...state,
            fields: fieldsHandler(field, state.fields),
          }));

          field = paymentCountries[0].fields[2];
          field.value = qrData?.accountNumber || '';

          setPaymentDetails(state => ({
            ...state,
            fields: fieldsHandler(field, state.fields),
          }));

          field = paymentCountries[0].fields[3];
          field.value = qrData?.city || '';

          setPaymentDetails(state => ({
            ...state,
            fields: fieldsHandler(field, state.fields),
          }));
        }

        setQrPreview(result);
      } catch (error) {
        setError('Failed to read the Qr Code');
        setQrPreview(undefined);
        setBankInfo(undefined);
        setPaymentDetails(paymentCountries[0]);
        console.error({ error });
      }
    };

    reader.readAsDataURL(imageFile);
  }, [fieldsHandler, imageFile]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      const valid = paymentDetails.fields.every(field => {
        const isValid = Boolean(field.value.trim());
        if (!isValid) {
          setError(`${field.label} is required`);
        }

        return isValid;
      });

      if (!valid) return;

      if (paymentDetails.countryCode === 'sg') {
        setBankInfo({
          bankDetails: {
            countryCode: paymentDetails.countryCode,
            mobileNumber: paymentDetails.fields[0]?.value,
          },
        });
        setIsOpen(true);
        return;
      }

      if (paymentDetails.countryCode === 'ph') {
        setBankInfo({
          bankDetails: {
            countryCode: paymentDetails.countryCode,
            bankName: paymentDetails.fields[0]?.value,
            accountName: paymentDetails.fields[1]?.value,
            accountNumber: paymentDetails.fields[2]?.value,
            city: paymentDetails.fields[3]?.value,
          },
        });
        setIsOpen(true);
        return;
      }

      setError('Unhandled country was proccessed');
    },
    [paymentDetails.countryCode, paymentDetails.fields]
  );

  return (
    <div className="mt-5 min-h-[628px] overflow-hidden rounded-xl bg-white p-5 md:mt-0 lg:p-10">
      <p className="font-semibold md:text-2xl">Provide your payment details</p>
      <p className="text-sm text-sleep-100">
        Provide your bank account details or upload a QR code below.
      </p>

      <ZPKycModal
        isOpen={isOpen}
        close={() => {
          setIsOpen(false);
          refectchBankInfo();
        }}
        bankInfo={bankInfo}
        walletAddress={walletAddress}
        saveBankInfo={saveBankInfo}
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
                onChange={e => {
                  const country = e.target.value;
                  const paymentDetails = paymentCountries.find(
                    ctrs => ctrs.countryCode === country
                  );

                  if (!paymentDetails) return;
                  setPaymentDetails(paymentDetails);
                }}
                value={paymentDetails.countryCode}
              >
                {paymentCountries.map(ctrs => (
                  <option key={ctrs.countryCode} value={ctrs.countryCode}>
                    {ctrs.name}
                  </option>
                ))}
              </select>
            </div>

            {paymentDetails.fields.map(field => (
              <div className="col-span-6" key={field.label}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-semibold text-sleep-100"
                >
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    id={field.id}
                    name={field.label}
                    autoComplete={field.label}
                    className="mt-1 block w-full rounded-md border border-[#E7E9EB] bg-white  py-2 px-3 text-sleep-100 shadow-sm focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                    onChange={e => {
                      const fieldValue = e.target.value;
                      field.value = fieldValue;

                      setPaymentDetails(state => ({
                        ...state,
                        fields: fieldsHandler(field, state.fields),
                      }));
                    }}
                    value={field.value}
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="mobileNumber"
                    id={field.id}
                    autoComplete={field.id}
                    className="mt-1 block w-full rounded-md border-[#E7E9EB] text-sleep-100 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    onChange={e => {
                      const fieldValue = e.target.value;
                      field.value = fieldValue;

                      setPaymentDetails(state => ({
                        ...state,
                        fields: fieldsHandler(field, state.fields),
                      }));
                    }}
                    value={field.value}
                  />
                )}
              </div>
            ))}
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
