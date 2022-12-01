import { PaymentDetails } from '@/pages';
import { FormEvent } from 'react';

interface Props {
  addPaymentDetails(paymentDetails: PaymentDetails): void;
}

function AddPaymentDetails({ addPaymentDetails }: Props) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addPaymentDetails({
      country: 'philippines',
      mobileNumber: '2321',
    });
  };

  return (
    <div className="mt-5 rounded-xl bg-white p-5 md:mt-0 lg:p-10">
      <p className="font-semibold md:text-2xl">Provide your payment details</p>
      <p className="text-sm text-sleep-100">
        Select your country and provide PayNow (SG) or InstaPay (PH) details
      </p>

      <form onSubmit={onSubmit}>
        <div className="overflow-hidden">
          <div className="bg-white py-5">
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
                  Mobile number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  id="mobileNumber"
                  autoComplete="mobileNumber"
                  className="mt-1 block w-full rounded-md border-[#E7E9EB] text-sleep-100 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="py-3 text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-2xl border border-transparent bg-brand py-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPaymentDetails;
