import { BankAccount } from '@/pages';
import { FormEvent } from 'react';

interface Props {
  addBankAccount(bankAccount: BankAccount): void;
}

function AddBankAccountForm({ addBankAccount }: Props) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addBankAccount({
      accountName: 'Hello',
      accountNumber: '1213',
      bank: 'bank',
      country: 'country',
    });
  };

  return (
    <div className="mt-5 rounded-xl bg-white p-5 md:mt-0 lg:p-10">
      <p className="font-semibold md:text-2xl">Add your bank account</p>
      <p className="text-sm text-sleep-100">
        Provide your bank account details or upload a QR code below.
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
                  <option>Malaysia</option>
                  <option>Philippines</option>
                  <option>Thailand</option>
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="bank"
                  className="block text-sm font-semibold text-sleep-100"
                >
                  Bank
                </label>
                <select
                  id="bnk"
                  name="bank"
                  autoComplete="bank"
                  className="mt-1 block w-full rounded-md border border-[#E7E9EB] bg-white  py-2 px-3 text-sleep-100 shadow-sm focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                >
                  <option>Bank 1</option>
                  <option>Bank 2</option>
                  <option>Bank 3</option>
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="accountAddress"
                  className="block text-sm font-semibold text-sleep-100"
                >
                  Account number
                </label>
                <input
                  type="text"
                  name="accountAddress"
                  id="accountAddress"
                  autoComplete="accountAddress"
                  className="mt-1 block w-full rounded-md border-[#E7E9EB] text-sleep-100 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-semibold text-sleep-100"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  autoComplete="streetAddress"
                  className="mt-1 block w-full rounded-md border-[#E7E9EB] text-sleep-100  shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
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

export default AddBankAccountForm;
